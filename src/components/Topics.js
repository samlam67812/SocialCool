import React, { useEffect, useState } from "react";
import firebase from "../utils/firebase";
import { collection, getDocs } from "firebase/firestore";
import { List } from "semantic-ui-react";
import { useLocation, Link } from "react-router-dom";

const Topics = () => {
  const [topics, setTopics] = useState([]);
  const location = useLocation();
  const urlSearchParams = new URLSearchParams(location.search);
  const currentTopic = urlSearchParams.get("topic");

  useEffect(() => {
    const loadData = async () => {
      const querySnapshot = await getDocs(
        collection(firebase.db, "topics")
      ).then((collectionSnapshot) => {
        const data = collectionSnapshot.docs.map((doc) => {
          return doc.data();
        });
        setTopics(data);
      });
    };
    loadData();
  }, []);

  return (
    <List animated selection>
      <List.Item
        key={"all"}
        as={Link}
        to={"../../posts"}
        active={!currentTopic}
      >
        ALL
      </List.Item>
      {topics.map((topic) => {
        return (
          <List.Item
            key={topic.name}
            as={Link}
            to={`../../posts?topic=${topic.name}`}
            active={currentTopic === topic.name}
          >
            {topic.name}
          </List.Item>
        );
      })}
    </List>
  );
};

export default Topics;
