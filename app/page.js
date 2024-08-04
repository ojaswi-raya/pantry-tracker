'use client'
import { firestore } from "@/firebase"
import { useState, useEffect } from "react"
import { getDocs, deleteDoc, doc, getDoc, collection, setDoc, query } from "firebase/firestore"
import { Box, Container, Modal, Typography, Stack, TextField, Button, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, IconButton } from "@mui/material"
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import EditIcon from '@mui/icons-material/Edit';
import { useTheme } from "@mui/material/styles"

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [currentItem, setCurrentItem] = useState(null)
  const [itemQuantity, setItemQuantity] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const theme = useTheme();

  const tableCellStyle = {
    header: {
      fontSize: '1.1rem', 
      fontWeight: 'bold',
      color: '#FFFFFF', 
      backgroundColor: theme.palette.secondary.main
    },
    body: {fontSize: '1rem'}
  }

  useEffect(()=> {
    const fetchInventory = async () => {
      const snapshot = await getDocs(collection(firestore, 'pantry'))
      const inventoryList = snapshot.docs.map(doc => ({
        name: doc.id,
        ...doc.data()
      }))
      setInventory(inventoryList)
    }
    fetchInventory()
  }, [])

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value)
  }

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'pantry'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc)=>{
      inventoryList.push({
        name: doc.id,
        ...doc.data()
      })
    })
    setInventory(inventoryList)
  }

  const removeItem = async (itemName) => {
    const docRef = doc(collection(firestore, 'pantry'), itemName)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const {quantity} = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      }
      else {
        await setDoc(docRef, {quantity: quantity-1})
      }
    }
    await updateInventory()
  }

  const updateItem = async (currentItemName, newItemName, newQuantity) => {
    const currentDocRef = doc(collection(firestore, 'pantry'), currentItemName.trim().toLowerCase())
    const currentDocSnap = await getDoc(currentDocRef)
    if (currentDocSnap.exists()) {
      if (currentItemName.trim().toLowerCase() != newItemName.trim().toLowerCase()) {
        const newDocRef = doc(collection(firestore, 'pantry'), newItemName.trim().toLowerCase());
        await setDoc(newDocRef, {quantity: parseInt(newQuantity)})
        await deleteDoc(currentDocRef)
      } else {
        await setDoc(currentDocRef, {quantity: parseInt(newQuantity)})
      }
    } else {
      console.warn(`Item "${currentItemName}" not found.`)
    }
    await updateInventory()
  }

  const addNewItem = async (itemName, itemQuantity) => {
    const cleanedItemName = itemName.trim().toLowerCase()
    const docRef = doc(collection(firestore, 'pantry'), cleanedItemName)
    const docSnap = await getDoc(docRef)
    const quantity = parseInt(itemQuantity)

    if (isNaN(quantity) || quantity <= 0) {
      console.warn("Invalid quantity.");
      return;
    }

    if (docSnap.exists()) {
      const {quantity: existingQuantity} = docSnap.data()
      await setDoc(docRef, {quantity: existingQuantity + quantity})
    } else {
      await setDoc(docRef, {quantity})
    }
    await updateInventory()
  }

  const addItem = async (itemName) => {
    const docRef = doc(collection(firestore, 'pantry'), itemName.trim().toLowerCase())
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const {quantity} = docSnap.data()
      await setDoc(docRef, {quantity: quantity + 1})
    } else {
      await setDoc(docRef, {quantity: 1})
    }
    await updateInventory()
  }

  useEffect(()=>{
    updateInventory()
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleEditOpen = (item) => {
    setCurrentItem(item)
    setItemName(item.name)
    setItemQuantity(item.quantity)
    setEditOpen(true)
  }
  const handleEditClose = () => setEditOpen(false)

  return (
    <Container>
      <Box sx={{ textAlign: 'center', m: 2, mt:4}}>
        <Typography variant="h5">Pantry Tracker</Typography>
        <Typography color='secondary' variant="h6">Track your items with ease ✨</Typography>
      </Box>
      <Box sx={{display:'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Box sx={{display:'flex', justifyContent:'space-between', width: '100%', maxWidth:600, mb:2}}>
        <TextField
            label="Search"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{mt:4, width: 'calc(100% - 170px)', height:'100%'}}
          />
          <Button 
            variant="contained" 
            color="secondary"
            onClick={()=> {handleOpen()}}
            sx={{mt: 6, color: '#FFFFFF', height:'100%'}}
          >
            Add New Item
          </Button>
        </Box>
        <TableContainer component={Paper} sx={{maxWidth:600, m:'0 auto', mt:2, maxHeight:'300px', overflow:'auto'}}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={tableCellStyle.header}>Item</TableCell>
                <TableCell align="right" sx={tableCellStyle.header}>Quantity</TableCell>
                <TableCell align="right" sx={tableCellStyle.header}> </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredInventory.map(({name, quantity}) => (
                  <TableRow key={name}>
                    <TableCell sx={tableCellStyle.body}>
                      {name.charAt(0).toUpperCase() + name.slice(1)}
                    </TableCell>
                    <TableCell align="right" sx={tableCellStyle.body}>{quantity}</TableCell>
                    <TableCell align="right" sx={tableCellStyle.body}>
                      <IconButton onClick={()=> addItem(name)}><AddIcon/></IconButton>
                      <IconButton onClick={()=> removeItem(name)}><RemoveIcon/></IconButton>
                      <IconButton onClick={()=> {handleEditOpen({ name, quantity })}}><EditIcon/></IconButton>
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/*Modal component for Add*/}
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute" top="50%" left="50%"
          width={400} bgcolor="white" border="2px solid #000"
          boxShadow={24} p={3} display="flex" 
          flexDirection="column" gap={3} sx={{transform: "translate(-50%, -50%)"}}
        >
          <Typography variant="body2">Add New Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField label="Item Name" fullWidth
            sx={{flex: 1}}
            value={itemName} onChange={(e)=>{
              setItemName(e.target.value)
            }}/>
            <TextField label="Quantity" fullWidth
            sx={{flex: 0.50}}
            value={itemQuantity} onChange={(e)=>{
              setItemQuantity(e.target.value)
            }}/>
          </Stack>
          <Button variant="text" onClick={()=>{
            addNewItem(itemName, itemQuantity)
            setItemName('')
            setItemQuantity('')
            handleClose()
          }}>Done</Button>
        </Box>
      </Modal>

      {/*Modal component for Edit*/}
      <Modal open={editOpen} onClose={handleEditClose}>
        <Box
          position="absolute" top="50%" left="50%"
          width={400} bgcolor="white" border="2px solid #000"
          boxShadow={24} p={3} display="flex" 
          flexDirection="column" gap={3} sx={{transform: "translate(-50%, -50%)"}}
        >
          <Typography variant="body2">Edit Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField label="Item Name" fullWidth
            sx={{flex: 1}}
            value={itemName} onChange={(e)=>{
              setItemName(e.target.value)
            }}/>
            <TextField label="Quantity" fullWidth
            sx={{flex: 0.50}}
            value={itemQuantity} onChange={(e)=>{
              setItemQuantity(e.target.value)
            }}/>
          </Stack>
          <Button variant="text" onClick={()=>{
            if (currentItem) {
              updateItem(currentItem.name, itemName, itemQuantity)
            }
            setItemName('')
            setItemQuantity('')
            handleEditClose()
          }}>Done</Button>
        </Box>
      </Modal>
    </Container>
  )
}
