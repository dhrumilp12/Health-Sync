import React from "react";

const Message = ({ notification }) => {
  return (
    <>
      <div>
        <span>{notification.title}</span>
      </div>
      <div>{notification.body}</div>
    </>
  );
};

export default Message;
