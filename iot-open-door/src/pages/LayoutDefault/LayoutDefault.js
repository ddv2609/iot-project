import { useEffect, useRef, useState } from "react";
import { Layout, notification } from "antd";
import { Outlet } from "react-router-dom";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

function LayoutDefault() {

  const recognizeRef = useRef(null);
  const [isRecognizeConnect, setIsRecognizeConnect] = useState(false);
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

  const initRecognizeSocket = () => {
    if (recognizeRef.current === null || !isRecognizeConnect) {
      console.log(`Connecting "/recognize"...`);
      recognizeRef.current = new WebSocket(`ws://localhost:8000/recognize`);

      recognizeRef.current.onopen = () => {
        console.log(`Connected to server - "/recognize"`);
        setIsRecognizeConnect(true);
      };

      recognizeRef.current.onmessage = async (message) => {
        try {
          const data = JSON.parse(JSON.parse(message.data));
          switch (data.type) {
            case "users":
              localStorage.setItem("users", JSON.stringify(data.users));
              break;
            default:
              openNotification("top", "Thông báo", "Mở cửa thành công!", "success");
              let audio = new Audio("/reng.mp3");
              audio.play();
              break;
          }
        } catch (error) {
          // console.log(`Error when recieve data "/recognize": ${error}`);
        }
      };

      recognizeRef.current.onclose = (event) => {
        if (event.wasClean) {
          console.log('Kết nối đã được đóng một cách đúng đắn.');
        } else {
          console.log(`Kết nối bị đóng với mã: ${event.code} và lý do: ${event.reason}`);
        }
        setIsRecognizeConnect(_ => false);
        console.log(`Disconnected from server - "/recognize"`);
        initRecognizeSocket();
      };
    }
  }

  useEffect(() => {
    console.log("Render Layout Default");
    initRecognizeSocket();

    return () => {
      if (recognizeRef.current !== null) {
        recognizeRef.current.close();
        console.log(`Disconnected from server - "/recognize"`);
      }
    }
  }, [])

  return (
    <>
      {contextHolder}
      <Layout
        style={{
          backgroundColor: "#fff"
        }}
      >
        <Header />
        <Outlet />
        <Footer />
      </Layout>
    </>
  )
}

export default LayoutDefault;