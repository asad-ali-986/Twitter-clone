import React, { useState, useEffect, useCallback, Fragment } from "react";
import { LeftSidebar,RightSidebar,Tweet } from "../../components";

import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

import { following } from "../../redux/userSlice";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [userTweets, setUserTweets] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    count: 0
  })

  const [currentPage, setcurrentPage] = useState(1);
  const handleChangePage = (_,page) => {
    setcurrentPage(page);
  }
  
  const { id } = useParams();
  const limit = 5;
  const dispatch = useDispatch();

  const fetchData = useCallback(async () => {
    try {
      const userTweets = await axios.get(`/tweets/user/all/${id}?currentPage=${currentPage}&limit=${limit}`);
      const userProfile = await axios.get(`/users/find/${id}`);

      setUserTweets(userTweets.data.results);
      setUserProfile(userProfile.data);
      setPagination({
        currentPage: userTweets.data.currentPage,
        count: userTweets.data.count
      });
    } catch (err) {
      console.log("error", err);
    }
  },[id, currentPage])

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFollow = async () => {
    if (!currentUser.following.includes(id)) {
      try {
        await axios.put(`/users/follow/${id}`, {
          id: currentUser._id,
        });
        dispatch(following(id));
      } catch (err) {
        console.log("error", err);
      }
    } else {
      try {
        await axios.put(`/users/unfollow/${id}`, {
          id: currentUser._id,
        });
        dispatch(following(id));
      } catch (err) {
        console.log("error", err);
      }
    }
  };

  return (
    <Fragment>
      <div className="grid grid-cols-1 md:grid-cols-4">
        <div className="px-6">
          <LeftSidebar />
        </div>
        <div className="col-span-2 border-x-2 border-t-slate-800 px-6">
          <div className="border-b-2 pb-6">
            <div className="flex justify-between items-center">
              <h5 className="font-bold text-1xl">Followers</h5>
              <h5 className="font-bold text-1xl">{userProfile?.followers?.length}</h5>
            </div>
            <div className="flex justify-between items-center mt-3">
              <h5 className="font-bold text-1xl">Following</h5>
              <h5 className="font-bold text-1xl">{userProfile?.following?.length}</h5>
            </div>
            <div className="flex justify-end items-center mt-3">
              {currentUser._id === id ? (
                <Fragment></Fragment>
              ) : currentUser.following.includes(id) ? (
                <button
                  className="px-4 -y-2 bg-blue-500 rounded-full text-white"
                  onClick={handleFollow}
                >
                  Following
                </button>
              ) : (
                <button
                  className="px-4 -y-2 bg-blue-500 rounded-full text-white"
                  onClick={handleFollow}
                >
                  Follow
                </button>
              )}
            </div>
          </div>
          <div className="mt-6">
            {userTweets &&
              userTweets.map((tweet) => {
                return (
                  <div className="p-2" key={tweet._id}>
                    <Tweet tweet={tweet} updateData={fetchData} />
                  </div>
                );
              })}
          </div>
          <div className="mt-6">
            <Stack direction="row" justifyContent="center" alignItems="flex-end">
              <Pagination
                count={Math.ceil(pagination.count/limit)} 
                variant="outlined" 
                shape="rounded" 
                size="large"
                hidden={pagination.count === 0}
                onChange={handleChangePage}>
              </Pagination>
            </Stack>
          </div>
        </div>

        <div className="px-6">
          <RightSidebar />
        </div>
      </div>
    </Fragment>
  );
};

export default Profile;
