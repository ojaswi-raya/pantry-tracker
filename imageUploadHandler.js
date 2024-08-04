import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import vision from '@google-cloud/vision'
import { firestore } from './firebase.js'

const client = new vision.ImageAnnotatorClient({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
})

async function uploadAndClassifyImage(imagePath) {
    try {
        const [result] = await client.labelDetection(imagePath)
        const labels = result.labelAnnotations
        console.log('Labels:')
        labels.forEach(label => console.log(label.description))

        const itemName = labels[0].description
        await firestore.collection('pantry').add({
            name: itemName, quantity: 1
        })

        console.log(`Item ${itemName} added to Firestore with quantity 1.`)
    } catch (error) {
        console.error(`Error uploading/classifying image: `, error)
    }
}

const imagePath = "./public/a pic 2.png"
uploadAndClassifyImage(imagePath)