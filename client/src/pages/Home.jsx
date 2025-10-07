import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { AuthContext } from "../context/AuthContext";
import { Row, Col, Container, Button, Spinner } from "react-bootstrap";
import BackupTable from "../components/BackupTable";
import { api } from "../services/api";
import { toast } from "react-toastify";
import Schedules from "../components/Schedules";

const Home = () => {
  const { role_name, name, email, password } = useContext(AuthContext);
  const [backupRunning, setBackupRunning] = useState(false);
  const { isLoading, userDispatch } = useContext(UserContext);
  const [isChanged, setIsChanged] = useState(false);
  const [options, setOptions] = useState("Backups");

  const handleRunBackupClick = async () => {
    try {
      setBackupRunning(true);
      const runBackup = await api.post(
        `${process.env.REACT_APP_SERVER_URL}/api/backups`,
        {}
      );
      if (runBackup.status === 201) {
        setBackupRunning(false);
        toast.success(`Backup Created Successfully`);
        setIsChanged(!isChanged)
        } else {
          setBackupRunning(false);
          toast.error(`Error Creating Backup`);
        }
    } catch (error) {
      setBackupRunning(false);
      console.log(error);
    }
  };

  const handleOptionsClick = () => {
    if (options === "Backups") {
      setOptions("Schedules");
    } else if (options === "Schedules") {
      setOptions("Backups");
    }
  };

  return (
    <>
      <Container fluid className="pt-4 dashboard-bg pb-5">
        <Row className="d-flex flex-column gap-4">
          <Col
            className="text-center mb-2 mt-3 d-flex flex-column justify-content-between heading-dash"
            xs={{ span: 10, offset: 1 }}
            sm={{ span: 10, offset: 1 }}
          >
            <div>Welcome {name.value.toUpperCase()}</div>{" "}
            <div className="fs-4">
              <img
                src="./images/access-padlock-protection-security-unlock-svgrepo-com.svg"
                alt="Role"
                className="img-size"
                style={{ height: `1.3em` }}
              />
              {role_name}
            </div>
          </Col>
          <Col xs={{ span: 10, offset: 1 }} sm={{ span: 10, offset: 1 }}>
            <Row className="d-flex align-items-center  sm:flex-row p-2 align-items-center">
              <Col className="heading-dash fs-3 text-center sm:text-start">
                All {options==="Backups"?"Backups":"Schedules"}
              </Col>
              {role_name === "Admin" && options==="Backups" && (
                <Col className="d-flex justify-content-center sm:justify-content-end">
                  <Button
                    className="heading-dash border border-none d-flex scale-on-hover align-items-center py-0 fs-5"
                    style={{
                      color: `yellow`,
                      backgroundColor: `#008080`,
                    }}
                  >
                    {backupRunning ? (
                      <div className="p-2">
                        <Spinner
                          animation="border d-flex align-items-center"
                          role="status"
                        />
                      </div>
                    ) : (
                      <>
                        <section
                          className=""
                          onClick={handleRunBackupClick}
                        >
                          <span>Backup Now</span>
                          <img
                            className="img-size-no-scale p-2"
                            src="./images/history-svgrepo-com.svg"
                            alt="backup img"
                          />
                        </section>
                      </>
                    )}
                  </Button>
                </Col>
              )}
            </Row>
          </Col>
          <Col className="d-flex justify-content-center flex-nowrap">
            <Row
              style={{ backgroundColor: "transparent" }}
              className="d-flex options-border rounded justify-content-between"
            >
              <Col
                onClick={handleOptionsClick}
                className={`p-2 px-3 cursor-pointer ${
                  options === "Backups" ? `options-selected` : ``
                } `}
              >
                Backups
              </Col>
              <Col
                onClick={handleOptionsClick}
                className={`p-2 px-3 cursor-pointer ${
                  options === "Schedules" ? `options-selected` : ``
                }`}
              >
                Schedules
              </Col>
            </Row>
          </Col>
          <Col xs={{ span: 10, offset: 1 }} sm={{ span: 10, offset: 1 }}>
            {options === "Backups" && (
              <BackupTable
                isChanged={isChanged}
                setIsChanged={setIsChanged}
              />
            )}
            {options === "Schedules" && <Schedules />}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Home;
