import React, { useEffect, useState } from "react";
import { Icon, Header, Image, Segment, Comment, Form, Message} from "semantic-ui-react";
import { useParams,  } from "react-router-dom";
import firebase from "../utils/firebase";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  writeBatch,
  increment,
  Timestamp,
  onSnapshot,
  collection,
  orderBy,
  query,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

const SinglePost = () => {
  const auth = getAuth();
  const batch = writeBatch(firebase.db);

  const { postId } = useParams();
  const [post, setPost] = useState({ author: "" });
  const [commentContent, setCommentContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [isError, setIsError] = useState(false);

  const currentUser = auth.currentUser ? auth.currentUser : "";
  const isBookmarked = auth.currentUser ? post.bookmark?.includes(auth.currentUser.uid) : "";
  const isLiked = auth.currentUser ? post.liked?.includes(auth.currentUser.uid):"";

  useEffect(() => {
    // on snapshot change
    const loadData = async () => {
      const docRef = doc(firebase.db, "posts", postId);
      const commentRef = collection(docRef, "comments");
      const orderRef = query(commentRef, orderBy("createAt"));
      const docSnap = await onSnapshot(docRef, (doc) => setPost(doc.data()));
      const commentSnap = await onSnapshot(orderRef, (snapshot) => {
        const data = snapshot.docs.map((doc) => {
          const id = doc.id;
          return { ...doc.data(), id };
        });
        setComments(data);
        setIsError(false);
      });
    };

    // if (docSnap.exists) {
    //   setPost(docSnap.data());
    // }
    loadData();
  }, []);

  const toggle = async (isActive, field) => {
    const uid = auth.currentUser.uid;
    const docRef = doc(firebase.db, "posts", postId);
    await updateDoc(docRef, {
      [field]: isActive ? arrayRemove(uid) : arrayUnion(uid),
    });
  };

  const onSubmit = async () => {
    setIsLoading(true);
    const docRef = doc(firebase.db, "posts", postId);
    if (!auth.currentUser) {
      window.alert("Please login before comment")
    } else {
      batch.update(docRef, {
          commentsCount: increment(1),
      });
      // comments is a subcollection of document posts
      const commentRef = doc(collection(docRef, "comments"));
      batch.set(commentRef, {
        content: commentContent,
        createAt: Timestamp.now(),
        author: {
          uid: auth.currentUser.uid || "",
          displayName: auth.currentUser.displayName || "",
          photoURL: auth.currentUser.photoURL || "",
        },
      });
      batch.commit().then(() => {
        setCommentContent("");
        setIsLoading(false);
      });
    }

  };

  return (
    <>
      {post.author.photoURL ? (
        <Image src={post.author.photoURL} />
      ) : (
        <Icon name="user circle" />
      )}
      {post.author.displayName || "User"}
      <Header>
        {post.title}
        <Header.Subheader>
          {post.topic}・{post.createAt?.toDate().toLocaleDateString()}
        </Header.Subheader>
      </Header>
      <Image src={post.imageUrl} />
      <Segment basic vertical>
        {post.content}
      </Segment>
      <Segment basic vertical>
        Comment {post.commentsCount || 0}・Like {post.liked?.length || 0}・
        <Icon
          name={`thumbs up${isLiked ? "" : " outline"}`}
          color={isLiked ? "blue" : "grey"}
          link
          onClick={() => {if(currentUser)
            {toggle(isLiked, "liked");
          setIsError(false)}
            else { setIsError(true) }
          }}
        />
        ・
        <Icon
          name={`bookmark${isBookmarked ? "" : " outline"}`}
          color={isBookmarked ? "blue" : "grey"}
          link
          onClick={() => { if(currentUser)
            {toggle(isBookmarked, "bookmark");setIsError(false)}
            else { setIsError(true) }
          }}
        />
      </Segment>
      { isError && <Message
          warning
          header='You must sign in before you can do that!'
          content='Visit our sign in page, then try again.'
        />}
      <Comment.Group>
        <Form reply>
          <Form.TextArea
            value={commentContent}
            placeholder="Leave comment here "
            onChange={(e) => setCommentContent(e.target.value)}
          />
          <Form.Button
            primary
            onClick={onSubmit}
            loading={isLoading}
            disabled={!commentContent}
          >
            <Icon name="clipboard outline" />
            Add Comment
          </Form.Button>
        </Form>
        <Header>
          <Icon name="comments outline" />
          {post.commentsCount || 0} Comments
        </Header>
        {comments.map((comment) => {
          return (
            <Comment key={comment.id}>
              <Comment.Avatar src={comment.author.photoURL} />
              <Comment.Content>
                <Comment.Author as="span">
                  {comment.author.displayName || "User"}
                </Comment.Author>
                <Comment.Metadata>
                  {comment.createAt.toDate().toLocaleDateString()}
                </Comment.Metadata>
                <Comment.Text>{comment.content}</Comment.Text>
              </Comment.Content>
            </Comment>
          );
        })}
      </Comment.Group>
    </>
  );
};

export default SinglePost;
