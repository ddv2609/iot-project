import { Button, Col, Input, Row, Space, Spin } from "antd";
import { useEffect, useRef, useState } from "react";
import { DeleteFilled, LoadingOutlined, UserOutlined } from "@ant-design/icons";

import styles from "./Control.module.css";

function Control({ isWsConnect, initWsSocket, listCaptureFaces, setListCaptureFaces, openNotification }) {
  const socketTrainRef = useRef(null);
  const [isTrainConnect, setIsTrainConnect] = useState(false);
  const userName = useRef("");
  const [disable, setDisable] = useState(localStorage.getItem("disable") === null ? false : JSON.parse(localStorage.getItem("disable")));
  const [processing, setProcessing] = useState(false);

  const initTrainSocket = async () => {
    if (socketTrainRef.current === null || !isTrainConnect) {
      console.log(`Connecting "/train"...`);
      socketTrainRef.current = new WebSocket(`ws://localhost:8000/train`);

      socketTrainRef.current.onopen = () => {
        console.log(`Connected to server - "/train"`);
        setIsTrainConnect(true);
      };

      socketTrainRef.current.onmessage = async (message) => {
        const data = JSON.parse(JSON.parse(message.data));
        let hasError = false;
        switch (data.status) {
          case "train success":
            // initWsSocket();
            openNotification("top", "Thông báo", "Thêm thành công người dùng vào hệ thống");
            break;
          case "namesake":
            openNotification("top", "Cảnh báo", "Tên người dùng đã được sử dụng vui lòng nhập lại", "warning");
            break;
          case "delete success":
            // initWsSocket();
            openNotification("top", "Thông báo", "Xóa thành công người dùng khỏi hệ thống");
            break;
          case "delete all success":
            // initWsSocket();
            openNotification("top", "Thông báo", "Xóa thành công toàn bộ người dùng khỏi hệ thống");
          break;
          case "error":
            hasError = true;
            openNotification("top", "Lỗi", "Xảy ra lỗi trong quá trình xử lý. Vui lòng thử lại sau", "error");
          break;
          default:
            break;
        }
        if (!hasError) {
          setListCaptureFaces(data.users);
        } 
        setProcessing(false);
      }

      socketTrainRef.current.onerror = (event) => {
        if (event.wasClean) {
          console.log('Kết nối đã được đóng một cách đúng đắn.');
        } else {
          console.log(`Kết nối bị đóng với mã: ${event.code} và lý do: ${event.reason}`);
        }
        setIsTrainConnect(_ => false);
        console.log(`Disconnected from server - "/train"`);
        initTrainSocket();
      };
    }
  }

  useEffect(() => {
    initTrainSocket();

    return () => {
      if (socketTrainRef.current !== null) {
        socketTrainRef.current.close();
        console.log(`Disconnected from server - "/train"`);
        setIsTrainConnect(false);
      }
    }
  }, [])

  const handleAddUser = (e) => {
    e.target.blur();
    const username = userName.current.trim();
    if (username !== "") {
      socketTrainRef.current.send(JSON.stringify({
        user: username,
        action: "add"
      }));
      setProcessing(true);
    }
  }

  const handleDeleteAll = () => {
    socketTrainRef.current.send(JSON.stringify({
      user: "",
      action: "delete all"
    }));
    setProcessing(true);
  }

  const handleRemoveCapture = (username) => {
    socketTrainRef.current.send(JSON.stringify({
      user: username,
      action: "delete"
    }));
    setProcessing(true);
  }

  return (
    <div className={styles.control}>
      <div className={styles.message}>automatic door opening system</div>
      <div className={styles.name}>
        <Input
          size="large"
          placeholder="Type the person's name here"
          prefix={<UserOutlined />}
          onChange={e => userName.current = e.target.value}
          onPressEnter={handleAddUser}
          allowClear
          disabled={disable || processing}
        />
      </div>
      <div className={styles.add}>
        <Button type="primary" block
          // disabled={!isWsConnect || processing}
          disabled={processing}
          onClick={handleAddUser}>
          ADD USER
        </Button>
      </div>
      <div className={styles.capture}>
        <Space size="middle">
          <span className={styles.heading}>Captured Faces</span>
          {processing ? (
            <>
              <span className={styles.processing}>Processing...</span>
              <Spin
                indicator={<LoadingOutlined />}
                size="middle"
              >
                <></>
              </Spin>
            </>
          ) : <></>}
        </Space>
        {
          listCaptureFaces ? (
            listCaptureFaces.map((user, key) => (
              <div className={styles.user} key={key}>
                <Space size="middle">
                  <span className={styles.username}>{user}</span>
                  <div className={styles.delete}>
                    <span
                      className={styles.iconDelete}
                      onClick={() => {
                        if (!processing) {
                          handleRemoveCapture(user);
                        }
                      }}
                    >
                      <DeleteFilled />
                    </span>
                  </div>
                </Space>
              </div>
            ))
          ) : (<></>)
        }
      </div>
      <div>
        <Row justify="space-between">
          <Col span={12}>
            <div className={styles.deleteAll}>
              <Button
                type="primary"
                block
                // disabled={!isWsConnect || listCaptureFaces.length === 0 || processing}
                disabled={listCaptureFaces.length === 0 || processing}
                onClick={e => handleDeleteAll(e)}
              >
                DELETE ALL
              </Button>
            </div>
          </Col>
          <Col span={12}></Col>
        </Row>
      </div>
    </div>
  );
}

export default Control;