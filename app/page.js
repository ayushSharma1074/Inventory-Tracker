'use client'
import {useState, useEffect, useRef} from 'react';
import {firestore} from '@/firebase'
import { Stack, Button, Container, Paper, Typography, Modal, style, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'

import {
  Box
} from '@mui/material'
import { dark } from "@mui/material/styles/createPalette";
import {Camera} from "react-camera-pro";
import { getStorage, ref, uploadBytes } from "firebase/storage";


export default function Home() {
  const [inventory, setInventory]=useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const camera = useRef(null);
  const [image, setImage] = useState(null);  

  const updateInventory = async() =>{
    const snapshot=query(collection(firestore, 'inventory'))
    const docs= await getDocs(snapshot)
    const inventoryList = []
    docs.forEach(doc => {
      inventoryList.push({
        name: doc.id,
        ...doc.data()
      })
      
    });
    setInventory(inventoryList)
  }

  const addToInventory =async (itemName) =>{
    const docRef=doc(collection(firestore, 'inventory'),itemName)
    const docsnap=await getDoc(docRef)
    if (docsnap.exists()){
      const { count }=docsnap.data()
      await setDoc(docRef,{count: count+1})

    }
    else
    {
      await setDoc(docRef,{count: 1})
    }
    updateInventory()
  }

  const uploadImage= async (image) => {
    const response = await fetch(image);
    const imgBlob = await response.blob();
    const timestamp = new Date().toISOString();
    const storage = getStorage();
    const storageRef = ref(storage, "images/" + timestamp+".png");
    uploadBytes(storageRef, imgBlob).then((snapshot) => {
      console.log('Uploaded a blob or file!');
    });
  }

  const removeFromInventory=async (itemName) => {
    const docRef=doc(collection(firestore,'inventory'), itemName)
    const docSnap= await  getDoc(docRef)
    const {count} = docSnap.data()
    if(docSnap.exists())
    { 
      if(count == 1)
      {
        await deleteDoc(docRef)
      }
      else
      {
        await setDoc(docRef,{count:count-1})
      }
      updateInventory()  
    }  
  }

  const handleOpen= () => {
    setOpen(true)
  }
  const handleClose= () => {
    setOpen(false)
  }
  
  useEffect(()=>{
    updateInventory()
  },[])

  return (
    <Container sx={{textAlign:"center",  '& > *':{p:2,m:4}}} spacing={5}>
      <Box sx={{justifyContent:"center", display:"flex"}}>
        <Button onClick={handleOpen} variant="contained">Add New Item</Button>
      </Box>
      <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Paper
          elevation={5}
          sx={{
            p: 4,
            borderRadius: 2,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="h6" component="div" gutterBottom>
            Add Item
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2}}>
            <Typography variant="body1" component="div"  sx={{ 'flexShrink': 0 }}>
              Item Name:
            </Typography>
            <TextField
              variant="outlined"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              fullWidth
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              onClick={() => {
                addToInventory(itemName);
                setItemName('');
                handleClose();
              }}
              variant="contained"
              color="primary"
            >
              Add Item
            </Button>
            <Button
              onClick={handleClose}
              variant="contained"
              color="primary"
            >
              Cancel
            </Button>
          </Box>
        </Paper>
      </Box>
    </Modal>
    <TableContainer component={Paper} sx={{ maxWidth: 800, margin: 'auto', border: '1px solid #333' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell colSpan={4} align="center" sx={{ bgcolor: '#ADD8E6' }}>
              <Typography variant="h4" color="#333">
                Inventory Items
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography variant="h6" color="#333">Item</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6" color="#333">Quantity</Typography>
            </TableCell>
            <TableCell colSpan={2} align="center">
              <Typography variant="h6" color="#333">Actions</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {inventory.map(({ name, count }) => (
            <TableRow key={name}>
              <TableCell>
                <Typography variant="h6" color="#333">
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6" color="#333">
                  {count}
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Button variant="contained" color="primary" onClick={() => removeFromInventory(name)}>
                  Remove
                </Button>
              </TableCell>
              <TableCell align="center">
                <Button variant="contained" color="primary" onClick={() => addToInventory(name)}>
                  Add Item
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

{/* 
    <Box border={'1px solid #333'} sx={{width:"fit-content", margin: 'auto'}}>
      <Box

        bgcolor={'#ADD8E6'}
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <Typography variant={'h4'} color={'#333'} textAlign={'center'}>
          Inventory Items
        </Typography>
      </Box>
      <Stack  spacing={2} overflow={'auto'}>
        {inventory.map(({name, count}) => (
          <Box
            key={name}
            width="100%"
            minHeight="150px"
            display={'flex'}
            justifyContent={'space-between'}
            alignItems={'center'}
            bgcolor={'#f0f0f0'}
            paddingX={5}
            
          >
            <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </Typography>
            <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
              Quantity: {count}
            </Typography>
            <Button variant="contained" onClick={() => 
              removeFromInventory(name)
              
              }>
              
              Remove
            </Button>
            <Button variant="contained" onClick={() => 
              addToInventory(name)
              
              }>
                Add Item
              </Button>
          </Box>
        ))}
      </Stack>
    </Box> */}
    {/* <div>
      <Camera ref={camera} facingMode="environment"  aspectRatio="2"/>
      <button onClick={() => {
          setImage(camera.current.takePhoto())
          uploadImage(image)
        }
      }>Take photo</button>
      <img src={image} alt='Taken photo'/>
    </div> */}
        
    </Container>
  );
}
