import clsx from "clsx";
import { Col, Row, notification } from "antd";
import { useEffect, useRef, useState } from "react";

import styles from "./Admin.module.css";
import Control from "../../components/Control/Control";
import Frame from "../../components/Frame/Frame";

function Admin() {
  const socketWsRef = useRef(null);
  const [isWsConnect, setIsWsConnect] = useState(false);
  const [listCaptureFaces, setListCaptureFaces] = useState(localStorage.getItem("users") ? JSON.parse(localStorage.getItem("users")) : []);
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (placement, message, description, type="info") => {
    switch (type) {
      case "warning":
        api.warning({
          message: <strong>{message}</strong>,
          description: description,
          placement,
        });
        break;
      case "error":
        api.error({
          message: <strong>{message}</strong>,
          description: description,
          placement,
        });
        break;
      case "success":
        api.success({
          message: <strong>{message}</strong>,
          description: description,
          placement,
        });
        break;
      default:
        api.info({
          message: <strong>{message}</strong>,
          description: description,
          placement,
        });
        break;
    }
  };

  // const initWsSocket = () => {
  //   if (socketWsRef.current === null || !isWsConnect) {
  //     console.log(`Connecting "/recognize"...`);
  //     socketWsRef.current = new WebSocket(`ws://localhost:8000/recognize`);

  //     socketWsRef.current.onopen = () => {
  //       console.log(`Connected to server - "/recognize"`);
  //       setIsWsConnect(true);
  //     };

  //     socketWsRef.current.onmessage = async (message) => {
  //       try {
  //         // if (loading) {
  //         //   setLoading(false);
  //         // }

  //         if (message.data instanceof Blob) {
  //           // let urlObject = URL.createObjectURL(message.data);
  //           // imageRef.current.src = urlObject;
  //         } else {
  //           const data = JSON.parse(JSON.parse(message.data));
  //           switch (data.type) {
  //             case "users":
  //               setListCaptureFaces(data.users);
  //               break;
  //             default:
  //               openNotification("top", "Thông báo", "Mở cửa thành công!", "success");
  //               let audio = new Audio("/reng.mp3");
  //               audio.play();
  //               break;
  //           }
  //         }
  //       } catch (error) {
  //         // console.log(`Error when recieve data "/recognize": ${error}`);
  //       }
  //     };

  //     socketWsRef.current.onclose = (event) => {
  //       if (event.wasClean) {
  //         console.log('Kết nối đã được đóng một cách đúng đắn.');
  //       } else {
  //         console.log(`Kết nối bị đóng với mã: ${event.code} và lý do: ${event.reason}`);
  //       }
  //       setIsWsConnect(_ => false);
  //       console.log(`Disconnected from server - "/recognize"`);
  //       initWsSocket();
  //     };
  //   }
  // }

  useEffect(() => {
    document.title = "Admin";

    // initWsSocket();

    return () => {
      // if (socketWsRef.current !== null) {
      //   socketWsRef.current.close();
      //   console.log(`Disconnected from server - "/recognize"`);
      // }
    }
  }, [])

  return (
    <div className={styles.admin}>
      {contextHolder}
      <div className={clsx([styles.wrapperAdmin, "container"])}>
        <Row justify="center">
          <Col span={10}>
            <Frame />
          </Col>
          <Col span={10}>
            <Control 
              // isWsConnect={isWsConnect} 
              // initWsSocket={initWsSocket}
              listCaptureFaces={listCaptureFaces} 
              setListCaptureFaces={setListCaptureFaces}
              openNotification={openNotification}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default Admin;