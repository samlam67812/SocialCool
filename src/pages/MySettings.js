import React, { useEffect, useState } from "react";
import {
  Button,
  Header,
  Modal,
  Segment,
  Input,
  Image,
  Form,
  List,
} from "semantic-ui-react";
import firebase from "../utils/firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  updateProfile,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import AvatarOptions from "../utils/avatars";

const MyName = ({ user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [displayName, setDisplayname] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = () => {
    setIsLoading(true);
    updateProfile(user, {
      displayName: displayName,
    })
      .then(() => {
        setDisplayname("");
        setIsModalOpen(false);
        setIsLoading(false);
      })
      .catch((error) => {});
  };

  return (
    <>
      <Header size="small">
        User DisplayName
        <Button floated="right" onClick={() => setIsModalOpen(true)}>
          Edit
        </Button>
      </Header>
      <Segment vertical>{user.displayName || ""}</Segment>
      <Modal open={isModalOpen} size="mini">
        <Modal.Header>Update User Displayname</Modal.Header>
        <Modal.Content>
          <Input
            placeholder="Enter your new user display name"
            value={displayName}
            onChange={(e) => setDisplayname(e.target.value)}
            fluid
          />
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setIsModalOpen(false)} color="red">
            Cancel
          </Button>
          <Button onClick={onSubmit} primary loading={isLoading}>
            Confirm
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
};

const MyPhoto = ({ user }) => {
  const storage = getStorage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [selectedAvator, setSelectedAvator] = useState("");

  const previewUrl = selectedAvator
    ? [`https://semantic-ui.com/images/avatar2/large/${selectedAvator}.png`]
    : file
    ? URL.createObjectURL(file)
    : user.photoURL || "";

  const onSubmit = () => {
    setIsLoading(true);
    const storageRef = ref(storage, "user-photos/" + user.uid);

    // file come from File API, upload to storage and get download URL
    // uploaded the file () and store URL
    if (file) {
      const metadata = { contentType: file.type };
      uploadBytes(storageRef, file, metadata)
        .then((snpaShot) => {
          getDownloadURL(storageRef)
            .then((url) => {
              updateProfile(user, {
                photoURL: url,
              })
                .then(() => {
                  setIsLoading(false);
                  setFile(null);
                  setSelectedAvator("");
                  setIsModalOpen(false);
                })
                .catch((error) => {});
            })
            .catch((error) => {});
        })
        .catch((error) => {});
    }
    //     if does not upload file and select provided avator
    else if (selectedAvator) {
      const url = `https://semantic-ui.com/images/avatar2/large/${selectedAvator}.png`;
      updateProfile(user, {
        photoURL: url,
      })
        .then(() => {
          setIsLoading(false);
          setFile(null);
          setSelectedAvator("");
          setIsModalOpen(false);
        })
        .catch((error) => {});
    }
  };

  return (
    <>
      <Header size="small">
        Profile Image
        <Button floated="right" onClick={() => setIsModalOpen(true)}>
          Edit
        </Button>
      </Header>
      <Segment vertical>
        <Image
          src={user.photoURL}
          avatar
          style={{
            fontSize: 70,
          }}
        />
      </Segment>

      <Modal open={isModalOpen} size="small">
        <Modal.Header>Update Profile Image</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            {" "}
            <Segment vertical>
              <Image
                src={previewUrl}
                avatar
                style={{
                  fontSize: 70,
                }}
              />{" "}
              <Button basic as="label" htmlFor="post-image">
                Upload Image
              </Button>
            </Segment>
            <Form.Input
              type="file"
              accept="image/*"
              id="post-image"
              style={{ display: "none" }}
              onChange={(e) => {
                setFile(e.target.files[0]);
                setSelectedAvator("");
              }}
            />
            Upload / Choose One as Profile Image: <br />
            <List animated selection horizontal>
              {AvatarOptions.map((avatarOption) => {
                return (
                  <List.Item
                    key={avatarOption}
                    onClick={() => {
                      setSelectedAvator(avatarOption);
                      setFile(null);
                    }}
                  >
                    <Image
                      avatar
                      style={{
                        border:
                          selectedAvator === avatarOption
                            ? "5px solid blue"
                            : "",
                      }}
                      //   bordered={selectedAvator === avatarOption}
                      src={`https://semantic-ui.com/images/avatar2/large/${avatarOption}.png`}
                    />
                  </List.Item>
                );
              })}
            </List>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setIsModalOpen(false)} color="red">
            Cancel
          </Button>
          <Button onClick={onSubmit} primary loading={isLoading}>
            Confirm
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
};

const MyPassword = ({ user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = () => {
    setIsLoading(true);
    const credential = EmailAuthProvider.credential(user.email, oldPassword);
    console.log(credential);
    reauthenticateWithCredential(user, credential).then(() => {
      updatePassword(user, newPassword)
        .then(() => {
          setIsModalOpen(false);
          setOldPassword("");
          setNewPassword("");
          setIsLoading(false);
        })
        .catch(() => {});
    });
  };
  return (
    <>
      <Header size="small">
        User Password
        <Button floated="right" onClick={() => setIsModalOpen(true)}>
          Edit
        </Button>
      </Header>
      <Segment vertical>**********</Segment>
      <Modal open={isModalOpen} size="mini">
        <Modal.Header>Change User Password</Modal.Header>
        <Modal.Content>
          <Header size="small">Current Password</Header>
          <Input
            placeholder="Enter current password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            fluid
          />
          <Header size="small">New Password</Header>
          <Input
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fluid
          />
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setIsModalOpen(false)} color="red">
            Cancel
          </Button>
          <Button onClick={onSubmit} primary loading={isLoading}>
            Confirm
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
};

const MySettings = ({ user }) => {
  return (
    <>
      <Header>User Profile</Header>
      <MyName user={user} />
      <MyPhoto user={user} />
      <MyPassword user={user} />
    </>
  );
};

export default MySettings;
