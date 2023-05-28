import { Menu, Search, Icon } from "semantic-ui-react";
import { Link, useNavigate, useHi } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import algolia from "./utils/algolia";
import { debounce } from "lodash";


function Header({ user }) {
  const [inputValue, setInputValue] = useState("");
  const [results, setResults] = useState([]);

  const auth = getAuth();
  const navigate = useNavigate();

  const onSearchChange = (e, {value}) => {
    setInputValue(value) 

    algolia.search(value).then((result) => {
      const searchResults = result.hits.map((hit) => {
        return {
          title: hit.title,
          description: hit.content,
          id: hit.objectID,
        };
      });
      setResults(searchResults);
    });
    
  };

  const onResultsSelect = (e, { result }) => {
    navigate(`/posts/${result.id}`);
  };

  return (
    <Menu>
      <Menu.Item as={Link} to="/posts">
        Social Cool
      </Menu.Item>
      <Menu.Item>
        <Search
          value={inputValue}
          onSearchChange={onSearchChange}
          results={results}
          noResultsMessage="No results found"
          onResultSelect={onResultsSelect}
        />
      </Menu.Item>
      <Menu.Menu position="right">
        {user ? (
          <>
            <Menu.Item as={Link} to="/new-post">
              <Icon name="edit" />
              {/* 發表文章 */}
              New Post
            </Menu.Item>
            <Menu.Item as={Link} to="/member">
              <Icon name="id badge outline" />
              {/* 會員 */}
              Profile
            </Menu.Item>
            <Menu.Item
              onClick={() => {
                auth.signOut();
                navigate("/posts");
              }}
            >
              <Icon name="sign-out" />
              {/* 登出 */}
              Sign out
            </Menu.Item>
          </>
        ) : (
          <Menu.Item as={Link} to="/signin">
            {/* 註冊/登入 */}
            Register/Sign in
          </Menu.Item>
        )}
      </Menu.Menu>
    </Menu>
  );
}

export default Header;
