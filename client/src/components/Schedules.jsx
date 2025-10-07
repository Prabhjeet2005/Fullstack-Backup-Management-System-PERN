import React from "react";
import { useContext, useEffect, useState } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import { UserContext } from "../context/UserContext";
import { api, ENDPOINTS } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const Schedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [cronValue, setCronValue] = useState("");
  const [jobName, setJobName] = useState("");
  const [changed, setChanged] = useState(false);
  const { isLoading, userDispatch } = useContext(UserContext);
  const { role_name } = useContext(AuthContext);

  useEffect(() => {
    (async () => {
      try {
        userDispatch({
          type: "LOADING_TRUE",
        });
        const getAllSchedules = await api.get(
          `${process.env.REACT_APP_SERVER_URL}/${ENDPOINTS.SCHEDULES.FETCH}`
        );
        const schedulesWithStatus = getAllSchedules.data.data.map(
          (schedule) => ({
            ...schedule,
            status: "noAction",
          })
        );
        if (schedulesWithStatus) {
          setSchedules(schedulesWithStatus);
        }
      } catch (error) {
        console.error(error);
      } finally {
        userDispatch({
          type: "LOADING_FALSE",
        });
      }
    })();
  }, [changed]);

  const getTimeAndDate = (str) => {
    let ans = "";
    const date = str.split("T")[0];
    let time = str.split("T")[1].split(".")[0];
    let seconds = str.split("T")[1].split(".")[0].split(":")[2];
    let minutes =
      parseInt(str.split("T")[1].split(".")[0].split(":")[1]) + 30;
    let carry = 0;
    if (minutes > 59) {
      carry = 1;
      minutes = minutes % 60;
    }
    let hours =
      parseInt(str.split("T")[1].split(".")[0].split(":")[0]) + 5 + carry;
    if (hours > 23) {
      hours = hours - 24;
    }
    hours = String(hours).padStart(2, "0");
    minutes = String(minutes).padStart(2, "0");
    time = `${hours}:${minutes}:${seconds}`;
    ans = time + " " + date;
    return ans;
  };

  const handleDeleteClick = async (scheduleId) => {
    userDispatch({
      type: "LOADING_TRUE",
    });
    try {
      const deletedBackup = await api.delete(
        `${process.env.REACT_APP_SERVER_URL}/api/schedule-auto-backup/${scheduleId}`
      );
      if (deletedBackup.status === 200) {
        setChanged(!changed);
        toast.success(`Schedule Deleted Successfully`);
      } else {
        toast.error(`Error Deleting Backup`);
      }
    } catch (error) {
      console.log(error);
    } finally {
      userDispatch({
        type: "LOADING_FALSE",
      });
    }
  };

  const getFrequency = (cron_pattern) => {
    let patternArr = cron_pattern.split(" ");
    if (
      patternArr[0] === "0" &&
      patternArr[1] === "30" &&
      patternArr[2] === "18" &&
      patternArr[3] === "*" &&
      patternArr[4] === "*" &&
      patternArr[5] === "0"
    ) {
      return `Weekly`;
    }
    if (
      patternArr[0] === "0" &&
      patternArr[1] === "30" &&
      patternArr[2] === "18" &&
      patternArr[3] === "*" &&
      patternArr[4] === "*" &&
      patternArr[5] === "*"
    ) {
      return `Daily`;
    }
    if (
      patternArr[0] === "0" &&
      patternArr[1] === "30" &&
      patternArr[2] === "18" &&
      patternArr[3] === "1" &&
      patternArr[4] === "*" &&
      patternArr[5] === "*"
    ) {
      return `Monthly`;
    }
  };

  const handleNewScheduleCreateClick = async (e) => {
    e.preventDefault();
    try {
      if(role_name !== "Admin"){
        toast.error("Not Authorized");
        return;
      }
      userDispatch({
        type: "LOADING_TRUE",
      });
      console.log(
        "🚀 ~ handleNewScheduleCreateClick ~ cronValue:",
        cronValue
      );
      console.log("🚀 ~ handleNewScheduleCreateClick ~ jobName:", jobName);
      // TODO UPDATE DAILY PATTERN UTC
      const scheduleExists = schedules.some(
        (scheduleIterator) => scheduleIterator.cron_string === cronValue
      );
      if (scheduleExists) {
        toast.error(`Schedule Already Exists`);
        return;
      }
      if (
        cronValue === "0 30 18 * * 0" ||
        cronValue === "0 30 18 * * *" ||
        cronValue === "0 30 18 1 * *"
      ) {
        const createNewSchedule = await api.post(
          `${process.env.REACT_APP_SERVER_URL}/${ENDPOINTS.SCHEDULES.CREATE}`,
          {
            job_name: jobName,
            cron_string: cronValue,
          }
        );
        if (createNewSchedule.status === 201) {
          setChanged(!changed);
          toast.success(`Successfully Created Schedule`);
        } else {
          toast.error(`Error Creating Schedule`);
        }
      } else {
        toast.error(`Schedule Name Or Frequency Missing`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      userDispatch({
        type: "LOADING_FALSE",
      });
    }
  };
  console.log("SCHEDULES: ", schedules);

  return (
    <>
      <section className="my-5 options-border p-5 text-black">
        <form
          className="d-flex flex-column justify-content-center gap-2 "
          method="post"
        >
          <div className="text-center schedule-heading">
            Create a New Schedule
          </div>
          <div className="d-flex justify-content-between p-1 mt-4 flex-column flex-sm-row gap-2 align-items-center gap-sm-4">
            <div
              style={{ color: `black`, fontWeight: `500` }}
              className="d-flex flex-shrink-0 text-center"
            >
              Name
            </div>
            <input
              className="bg-white outline-none text-start px-3 schedules-select text-black p-1"
              placeholder="Enter Schedule Name"
              type="text"
              onChange={(e) => setJobName(e.target.value)}
            />
          </div>
          <div className="d-flex p-1 justify-content-between mb-4 flex-column flex-sm-row gap-2 align-items-center gap-sm-4">
            <div
              style={{ color: `black`, fontWeight: `500` }}
              className="d-flex flex-shrink-0 text-center"
            >
              Frequency
            </div>
            <select
              value={cronValue}
              onChange={(e) => setCronValue(e.target.value)}
              name=""
              className="bg-transparent outline-none text-center schedules-select text-black p-1"
              id=""
              style={{ borderRadius: `0px` }}
            >
              <option className="options-value" value="">
                Select A Frequency
              </option>
              <option className="options-value" value="0 30 18 * * *">
                Daily
              </option>
              <option className="options-value" value="0 30 18 * * 0">
                Weekly
              </option>
              <option className="options-value" value="0 30 18 1 * *">
                Monthly
              </option>
            </select>
          </div>
          <button
            onClick={handleNewScheduleCreateClick}
            className="p-2 rounded bg-transparent outline-none text-center  schedule-btn text-black"
          >
            Schedule
          </button>
        </form>
      </section>
      <Container fluid />
      <Row className="d-flex justify-space-between align-items-center">
        <Col
          xs={{ span: 12 }}
          className="table-structure fs-5 d-flex text-center justify-space-between align-items-center"
        >
          <table className="" responsive="sm">
            <thead>
              <tr>
                <th>NAME</th>
                <th>BACKUP TIME</th>
                <th>CREATED AT</th>
                <th>CREATED BY</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody className="fs-5">
              {schedules.length > 0 ? (
                schedules.map((schedule) => {
                  return (
                    <>
                      <tr className="text-center">
                        <td>{schedule.job_name}</td>
                        <td>{getFrequency(schedule.cron_string)}</td>
                        <td>{getTimeAndDate(schedule.created_at)}</td>
                        <td>{schedule.created_by}</td>
                        <td>
                          <div className="d-flex justify-content-center align-items-center">
                            {role_name === "Admin" ? (
                              <img
                                onClick={() =>
                                  handleDeleteClick(schedule.id)
                                }
                                className="img-size"
                                src="./images/delete-2-svgrepo-com.svg"
                                alt="Delete"
                              />
                            ) : (
                              <>N/A</>
                            )}
                          </div>
                        </td>
                      </tr>
                    </>
                  );
                })
              ) : (
                <>
                  <td></td>
                  <td></td>
                  <td className="text-black">No Schedules Found</td>
                  <td></td>
                  <td></td>
                </>
              )}
            </tbody>
          </table>
        </Col>
      </Row>
    </>
  );
};

export default Schedules;
