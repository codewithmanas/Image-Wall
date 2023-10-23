import './App.css'
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';


// https://wocdclykogzqtcyerjlb.supabase.co/storage/v1/object/public/images/48913ffe-3baa-416f-9d15-a5044f7b0c6e/9fead044-27dc-4f04-b3c2-883fa97b9375

const CDNURL = "https://wocdclykogzqtcyerjlb.supabase.co/storage/v1/object/public/images/";

//  CDNURL + user.id + "/" + image.name

function App() {
    const [email, setEmail] = useState("");
    const [images, setImages] = useState([]);
    const user = useUser();
    const supabase = useSupabaseClient();


    // console.log(email)

    async function getImages() {
      const { data, error } = await supabase
      .storage
      .from("images")
      .list(user?.id + "/", {
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "asc"}
      })

      // Cooper
      // data: [image1, image2, image3]
      // 

      if(data !== null) {
        setImages(data);
      } else {
        alert("Error Loading Images");
        console.log(error);
      }

    }

    async function uploadImage(e) {
        // console.log(e.target.files[0].name);
        const file = e.target.files[0]

        // userId: Cooper
        // Cooper/
        // Cooper/imageName.png = allowed
        // John/imageName.png = not allowed

        const { data, error } = await supabase
        .storage
        .from("images")
        .upload(user.id + "/" + uuidv4(), file) // Cooper/majnshggeh/imageName.png

        if(data) {
          getImages();
        } else {
          console.log(error);
        }

    }

    useEffect(() => {
          if(user) {
            getImages();
          }
    },[user])

    async function magicLinkLogin() {
      const { data, error } = await supabase.auth.signInWithOtp({
        email: email,
      });

      if(error) {
        alert("Error Occured, ,Make sure to enter valid email.")
        console.log(error);
      } else {
        alert("Check your email for a Supabase Magic Link.")
      }
    }

    // Sign Out Function
    async function signOut() {
      const { error } = await supabase.auth.signOut();
    }

  return (
    <Container align="center" className='container-sm mt-4 '>
      {/* 
        / if the user doesn't exist : show the login page
        / if the user exist : show them images/upload images pages
      */}

        {
          user === null ? (
              <>
                <h1>Welcome to ImageWall</h1>
                <Form>
                  <Form.Group className='mb-3' style={{maxWidth: "500px"}}>
                      <Form.Label>
                          Enter an email to sign in with a Supabase Magic Link
                      </Form.Label>
                      <Form.Control
                        type='email'
                        placeholder='Enter Email'
                        onChange={e => setEmail(e.target.value)}
                      />
                      
                  </Form.Group>
                  <Button variant='primary' onClick={() => magicLinkLogin()}>
                      Get Magic Link
                  </Button>
                </Form>
              </>
          ) : (
              <>
                <h1>Your ImageWall</h1>
                <Button variant='warning' onClick={() => signOut()}>Sign Out</Button>
                <p>You are LoggedIn: {user.email}</p>
                <p>Use the choose file button below to upload an image to your gallery</p>
                <Form.Group className='mb-3' style={{maxWidth: "500px"}}>
                  <Form.Control
                    type='file'
                    accept='image/jpeg, image/png'
                    onChange={e => uploadImage(e)}
                  />


                </Form.Group>
                <hr />
                <h3>Your Images</h3>
                {/* To get an image: CDNURL + user.id + "/" + image.name */}
                <Row xs={1} md={3} className='g-4'>
                      {
                        images.map((image) => (
                          <Col key={CDNURL + user.id + "/" + image.name}>
                              <Card>
                                <Card.Img variant='top' 
                                src={CDNURL + user.id + "/" + image.name} />

                                <Card.Body>
                                  <Button variant='danger'>Delete Images</Button>
                                </Card.Body>
                              </Card>
                          </Col>
                        ))
                      }
                </Row>
              </>
          )
        }




    </Container>
  )
}

export default App
