import axios from "axios";
import React, { Fragment } from "react";
import formatDistance from "date-fns/formatDistance";

import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

const Tweet = ({ tweet, updateData }) => {
  const { currentUser } = useSelector((state) => state.user);
  const dateStr = formatDistance(new Date(tweet.createdAt), new Date());

  const handleLike = async (e) => {
    try {
      await axios.put(`/tweets/${tweet._id}/like`, {
        id: currentUser._id,
      });
      updateData();
    } catch (err) {
      console.log("error", err);
    }
  };

  const handleDelete = async (e) => {
    try {
      await axios.delete(`/tweets/${tweet._id}?id=${currentUser._id}`);
      updateData();
    } catch (err) {
      console.log("error", err);
    }
  };

  return (
    <Fragment>
      <div className="flex space-x-2">
        <Link to={`/profile/${tweet.user[0]._id}`}>
          <h3 className="font-bold">{tweet.user[0].username}</h3>
        </Link>

        <span className="font-normal">@{tweet.user[0].username}</span>
        <p> - {dateStr}</p>
      </div>

      <p>{tweet.description}</p>
      <div className="flex space-x-4">
      <button onClick={handleLike}>
        {tweet.likes.includes(currentUser._id) ? (
          <ThumbUpIcon className="mr-2 my-2 cursor-pointer"></ThumbUpIcon>
        ) : (
          <ThumbUpOutlinedIcon className="mr-2 my-2 cursor-pointer"></ThumbUpOutlinedIcon>
        )}
        {tweet.likes.length}
      </button>
      {tweet.userId === currentUser._id &&
        <button  onClick={handleDelete}>
          <DeleteIcon className="mr-2 my-2 cursor-pointer"></DeleteIcon>
        </button>
      }
      </div>
    </Fragment>
  );
};

export default Tweet;
