import React, { Fragment, useCallback, useEffect, useState } from "react";

import axios from "axios";
import Tweet from "../Tweet";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

const ExploreTweets = () => {
  const [tweets, setTweets] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    count: 0
  })
  const [currentPage, setcurrentPage] = useState(1);
  const handleChangePage = (_,page) => {
    setcurrentPage(page);
  }
  const fetchData = useCallback(async () => {
      try {
        const exploreTweets = await axios.get(`/tweets/explore?currentPage=${currentPage}&limit=${limit}`);
        setTweets(exploreTweets.data.results);
        setPagination({
          currentPage: exploreTweets.data.currentPage,
          count: exploreTweets.data.count
        });
      } catch (err) {
        console.log("error", err);
      }
  },[currentPage])

  const limit = 5;

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  return (
    <Fragment>
      <div className="mt-6">
        {tweets &&
          tweets.map((tweet) => {
            return (
              <div key={tweet._id} className="p-2">
                <Tweet tweet={tweet} updateData={fetchData} />
              </div>
            );
          })}
      </div>
      <div>
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

export default ExploreTweets;
