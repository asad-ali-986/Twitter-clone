import React, { useEffect, useState, useCallback, Fragment } from "react";
import axios from "axios";

import { useSelector } from "react-redux";
import Tweet from "../Tweet";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

const TimelineTweet = () => {
  const [timeLine, setTimeLine] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    count: 0
  })
  const { currentUser } = useSelector((state) => state.user);
  const [currentPage, setcurrentPage] = useState(1);
  const handleChangePage = (_,page) => {
    setcurrentPage(page);
  }
  const limit = 5;

  const fetchData = useCallback(async () => {
    try {
      const timelineTweets = await axios.get(
        `/tweets/timeline/${currentUser._id}?currentPage=${currentPage}&limit=${limit}`
      );

      setTimeLine(timelineTweets.data.results);
      setPagination({
        currentPage: timelineTweets.data.currentPage,
        count: timelineTweets.data.count
      });
    } catch (err) {
      console.log("error", err);
    }
  },[currentUser._id,currentPage])



  useEffect(() => {
    fetchData();
  }, [fetchData]);

  console.log("Timeline", timeLine);
  return (
    <Fragment>
      <div className="mt-6">
        {timeLine &&
          timeLine.map((tweet) => {
            return (
              <div key={tweet._id} className="p-2">
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
    </Fragment>
  );
};

export default TimelineTweet;
