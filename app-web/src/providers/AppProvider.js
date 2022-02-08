import React, { useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { ConversationsPageContext } from "../contexts/ConversationsPageContext";
import { getCurrentUser } from "../services/authenticationService";

function AppProvider(props) {
  const [user, setUser] = useState(getCurrentUser());
  const [conversationsPage, setConversationsPage] = useState(1);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <ConversationsPageContext.Provider
        value={{ conversationsPage, setConversationsPage }}
      >
        {props.children}
      </ConversationsPageContext.Provider>
    </UserContext.Provider>
  );
}

export default AppProvider;
