import React, { useEffect, useState } from "react";
import { Container, Header, Form, Image, Button } from "semantic-ui-react";
import firebase from "../utils/firebase";
import {
  collection,
  getDocs,
  Timestamp,
  setDoc,
  doc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { useNavigate } from "react-router-dom";

const NewPost = () => {
  const auth = getAuth();
  const storage = getStorage();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [topics, setTopics] = useState([]);
  const [topicName, setTopicName] = useState([]);
  const [file, setFile] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const querySnapshot = await getDocs(
        collection(firebase.db, "topics")
      ).then((collectionSnapshot) => {
        const data = collectionSnapshot.docs.map((doc) => {
          return doc.data();
        });
        // console.log(data);
        setTopics(data);
      });
    };
    loadData();
  }, []);

  const options = topics.map((topic) => {
    return {
      text: topic.name,
      value: topic.name,
    };
  });

  const previewUrl = file
    ? URL.createObjectURL(file)
    : "https://react.semantic-ui.com/images/wireframe/image.png";


  const onSubmit = async () => {
    setIsLoading(true);

    const collectionRef = collection(firebase.db, "posts");
    const docmentRef = doc(collectionRef);
    const storageRef = ref(storage, "post-images/" + docmentRef.id);
    const metadata = {
      contentType: file.type,
    };

    // file come from BLOB or File API, upload the images first and set download url, finally set it to the postdata
    if (file) {
      uploadBytes(storageRef, file, metadata)
        .then((snpaShot) => {
          getDownloadURL(storageRef)
            .then((url) => {
              const postData = {
                title: title,
                content: content,
                topic: topicName,
                createAt: Timestamp.now(),
                author: {
                  displayName: auth.currentUser.displayName || "",
                  photoUrl: auth.currentUser.photoURL || "",
                  uid: auth.currentUser.uid,
                  email: auth.currentUser.email,
                },
                imageUrl: url || "",
              };

              setDoc(docmentRef, postData)
                .then(() => {
                  setIsLoading(false);
                  navigate("/");
                })
                .catch((error) => {
                  setIsLoading(false);
                });
            })
            .catch((error) => {});
        })
        .catch((error) => {});
    } else {
      const postData = {
        title: title,
        content: content,
        topic: topicName,
        createAt: Timestamp.now(),
        author: {
          displayName: auth.currentUser.displayName || "",
          photoUrl: auth.currentUser.photoURL || "",
          uid: auth.currentUser.uid,
          email: auth.currentUser.email,
        },
        imageUrl: "",
      };
      setDoc(docmentRef, postData)
        .then(() => {
          setIsLoading(false);
          navigate("/");
        })
        .catch((error) => {
          setIsLoading(false);
        });
    }
  };
  return (
    <Container>
      <Header>
        {/* 發表文章 */}
        New Post
      </Header>
      <Form onSubmit={onSubmit}>
        <Image src={previewUrl} size="medium" floated="left" />
        <Button basic as="label" htmlFor="post-image">
          Upload Image
        </Button>
        <Form.Input
          type="file"
          accept="image/*"
          id="post-image"
          style={{ display: "none" }}
          onChange={(e) => setFile(e.target.files[0])}
        />
        <Form.Input
          placeholder="Enter Post Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Form.TextArea
          placeholder="Enter Post Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Form.Dropdown
          placeholder="Select Post Topic"
          options={options}
          selection
          multiple
          value={topicName}
          onChange={(e, { value }) => setTopicName(value)}
        />
        <Form.Button loading={isLoading}>Submit</Form.Button>
      </Form>
    </Container>
  );
};

export default NewPost;
