import React, { useContext, useEffect, useState } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import { UserContext } from "../context/UserContext";
import { api, ENDPOINTS } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const BackupTable = ({isChanged , setIsChanged}) => {
  const { isLoading, userDispatch } = useContext(UserContext);
  const { role_name } = useContext(AuthContext);
  const [backupArr, setBackupArr] = useState([]);
  // const [status,setStatus] = useState({success:false,noAction:true,error:false,downloading:false})
  useEffect(() => {
    // EDGE CASE: To Avoid Infinite Re-renders Add useEffect in ProtectedRoute
    (async () => {
      try {
        userDispatch({
          type: "LOADING_TRUE",
        });
        // CACHE BURSTING  TO RELOAD CACHED DATA
        const cacheBursting = new Date().getTime()

        const getAllBackups = await api.get(
          `${process.env.REACT_APP_SERVER_URL}/${ENDPOINTS.BACKUP.FETCH}/?_cb=${cacheBursting}`
        );
        const backupWithStatus = getAllBackups.data.data.rows.map(
          (backup) => ({
            ...backup,
            status: "noAction",
          })
        );
        if (backupWithStatus) {
          setBackupArr(backupWithStatus);
        }
      } catch (error) {
        console.error(error);
      } finally {
        userDispatch({
          type: "LOADING_FALSE",
        });
      }
    })();
  }, [isChanged]); // isChanged passed From Parent to force re-render this component when backup created

	

  const getTimeAndDate = (str) => {
    let ans = "";
    const date = str.split("T")[0];
    let time = str.split("T")[1].split(".")[0];
		let seconds = str.split("T")[1].split(".")[0].split(":")[2];
		let minutes =
      parseInt(str.split("T")[1].split(".")[0].split(":")[1]) + 30;
		let carry = 0;
		if(minutes > 59){
			carry = 1;
			minutes = minutes % 60;
		}
		let hours =
      parseInt(str.split("T")[1].split(".")[0].split(":")[0]) + 5 + carry;
    if(hours > 23){
      hours = hours - 24
    }
    hours = String(hours).padStart(2,"0")
    minutes = String(minutes).padStart(2,"0")
		time = `${hours}:${minutes}:${seconds}`
    ans = time + " " + date;
    return ans;
  };

  const getBackupSize = (str) => {
    const bytes = parseFloat(str);
    if (isNaN(bytes) || bytes === 0) {
      return "0 Bytes";
    }

    const fixed = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

    const i = Math.floor(Math.log(bytes) / Math.log(fixed));

    // Handle cases where the size might be enormous
    if (i >= sizes.length) {
      const val = bytes / Math.pow(fixed, sizes.length - 1);
      return `${parseFloat(val.toFixed(2))} ${sizes[sizes.length - 1]}`;
    }

    const val = bytes / Math.pow(fixed, i);
    return `${parseFloat(val.toFixed(2))} ${sizes[i]}`;
  };

  const handleDownloadClick = async (backupId) => {
    try {
      userDispatch({
        type: "LOADING_TRUE",
      });
      setBackupArr((currBackup) =>
        currBackup.map((backups) =>
          backups.id === backupId
            ? { ...backups, status: "downloading" }
            : backups
        )
      );
      const response = await api.get(
        `${process.env.REACT_APP_SERVER_URL}/api/backups/${backupId}/download`,
        { responseType: "blob" }
      );
      if (response.status != 200) {
        setBackupArr((currBackup) =>
          currBackup.map((backups) =>
            backups.id === backupId
              ? { ...backups, status: "error" }
              : backups
          )
        );
        toast.error(`Error Downloading Backup`);
      } else {
        const blob = response.data;
        const link = document.createElement("a");
        const url = window.URL.createObjectURL(blob);
        link.href = url;
        link.setAttribute("download", `backup-${backupId}.dump`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
        setBackupArr((currBackup) =>
          currBackup.map((backups) =>
            backups.id === backupId
              ? { ...backups, status: "success" }
              : backups
          )
        );
        toast.success(`Backup Downloaded Successfully!`);
      }
    } catch (error) {
      console.error(error);
      toast.error(error);
    } finally {
      userDispatch({
        type: "LOADING_FALSE",
      });
    }
  };

  const handleDeleteClick = async (backupId) => {
    userDispatch({
      type: "LOADING_TRUE",
    });
    try {
			const deletedBackup = await api.delete(
				`${process.env.REACT_APP_SERVER_URL}/api/backups/${backupId}/delete`
			)
			if(deletedBackup.status === 200){
				setIsChanged(!isChanged);
				toast.success(`Backup Deleted Successfully`)
			}else{
				toast.error(`Error Deleting Backup`)
			}
    } catch (error) {
      console.log(error);
    }finally{
			userDispatch({
				type:"LOADING_FALSE"
			})
		}
  };

  return (
    <>
      <Container fluid />
      <Row className="d-flex justify-space-between align-items-center">
        <Col
          xs={{ span: 12 }}
          className="table-structure fs-5 d-flex text-center justify-space-between align-items-center"
        >
          <table className="" responsive="sm">
            <thead>
              <tr>
                <th>CREATED AT</th>
                <th>FILE SIZE</th>
                <th>CREATED BY</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody className="fs-5">
              {backupArr.length > 0 ?
                backupArr.map((backup) => {
                  return (
                    <>
                      <tr className="text-center">
                        <td>{getTimeAndDate(backup.created_at)}</td>
                        <td>{getBackupSize(backup.file_size_bytes)}</td>
                        {console.log("🚀 ~ getBackupSize ~ backup.file_size_bytes:", backup.file_size_bytes)}
                        <td>{backup.created_by}</td>
                        <td className="alert-success">
                          {backup.status === "success" && (
                            <img
                              className="img-size-no-scale no-info"
                              src="./images/success-filled-svgrepo-com.svg"
                              alt="success"
                            />
                          )}
                          {backup.status === "noAction" && (
                            <img
                              className="img-size-no-scale no-info"
                              src="./images/dash-lg-svgrepo-com.svg"
                              alt="noAction"
                            />
                          )}
                          {backup.status === "error" && (
                            <img
                              className="img-size-no-scale no-info"
                              src="./images/exclamation-circle-confirm-delete.svg"
                              alt="error"
                            />
                          )}
                          {backup.status === "downloading" && (
                            <img
                              className="img-size-no-scale no-info"
                              src="./images/clock-pending-time-svgrepo-com (1).svg"
                              alt="error"
                            />
                          )}
                        </td>
                        <td>
                          <div className="d-flex justify-content-center align-items-center">
                            {/* <a
                                href={`${process.env.REACT_APP_SERVER_URL}/api/backups/${backup.id}/download`}
                                download
                              > */}
                            <img
                              onClick={() =>
                                handleDownloadClick(backup.id)
                              }
                              className="img-size"
                              src="./images/download-svgrepo-com (1).svg"
                              alt="Download"
                            />
                            {/* </a> */}
                            {role_name === "Admin" && (
                              <img
                                onClick={() =>
                                  handleDeleteClick(backup.id)
                                }
                                className="img-size"
                                src="./images/delete-2-svgrepo-com.svg"
                                alt="Delete"
                              />
                            )}
                          </div>
                        </td>
                      </tr>
                    </>
                  );
                }):<><td></td>
                <td></td>
                <td className="text-black">No Backups Found</td>
                <td></td>
                <td></td></>}
            </tbody>
          </table>
        </Col>
      </Row>
    </>
  );
};

export default BackupTable;
