import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { AuthContext } from "../context/AuthContext";
import { Row, Col, Container, Button, Spinner } from "react-bootstrap";
import BackupTable from "../components/BackupTable";
import { api } from "../services/api";
import { toast } from "react-toastify";

const Home = () => {
  const { role_name, name, email, password } = useContext(AuthContext);
  const [backupRunning, setBackupRunning] = useState(false);
  const { isLoading,userDispatch } = useContext(UserContext);
	const [isChanged,setIsChanged] = useState(false);

  const handleRunBackupClick = async () => {
    try {
      setBackupRunning(true);
      const runBackup = await api.post(
        `${process.env.REACT_APP_SERVER_URL}/api/backups`,
        {}
      );
      if (runBackup.status === 201) {
        toast.success(`Backup Created Successfully`);
				setIsChanged(!isChanged)
      } else {
        toast.error(`Error Creating Backup`);
      }
    } catch (error) {
			console.log(error);
    } finally {
      setBackupRunning(false);
      
    }
  };
  return (
    <>
      <Container fluid className="pt-4 dashboard-bg pb-5">
        <Row className="d-flex flex-column gap-4">
          <Col
            className="text-center sm:d-flex justify-content-between heading-dash"
            xs={{ span: 10, offset: 1 }}
            sm={{ span: 10, offset: 1 }}
          >
            <div>Welcome {name.value.toUpperCase()}</div>{" "}
            <div className="">
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
              <Col className="heading-dash text-center sm:text-start">
                Backup Dashboard
              </Col>
              {role_name === "Admin" && (
                <Col className="d-flex justify-content-center sm:justify-content-end">
                  <Button
                    className="heading-dash d-flex scale-on-hover align-items-center fs-4"
                    style={{
                      color: `yellow`,
                      backgroundColor: `#008080`,
                    }}
                  >
                    {backupRunning ? (
                      <div>
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
                          <span>Run Backup</span>
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
          <Col xs={{ span: 10, offset: 1 }} sm={{ span: 10, offset: 1 }}>
            <BackupTable
              isChanged={isChanged}
              setIsChanged={setIsChanged}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Home;
