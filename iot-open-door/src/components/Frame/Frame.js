import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { useEffect, useRef, useState } from "react";

import styles from "./Frame.module.css";

function Frame() {
  const HOST = "192.168.207.38";
  const [loading, setLoading] = useState(true);
  const imageRef = useRef({ src: null });
  const socketVideoRef = useRef(null);
  const [isVideoConnect, setIsVideoConnect] = useState(false);

  const initVideoSocket = () => {
    if (socketVideoRef.current === null || !isVideoConnect) {
      console.log(`Connecting [${HOST}]...`);
      socketVideoRef.current = new WebSocket(`ws://${HOST}:60/`);

      socketVideoRef.current.onopen = () => {
        console.log(`Connected to server - [${HOST}]`);
        setIsVideoConnect(true);
      };

      socketVideoRef.current.onmessage = async (message) => {
        try {
          if (loading) {
            setLoading(false);
          }
          if (message.data instanceof Blob) {
            let urlObject = URL.createObjectURL(message.data);
            imageRef.current.src = urlObject;
          }
        } catch (error) {
          // console.log(`Error when recieve data [${HOST}]: ${error}`);
        }
      };

      socketVideoRef.current.onclose = (event) => {
        if (event.wasClean) {
          console.log('Kết nối đã được đóng một cách đúng đắn.');
        } else {
          console.log(`Kết nối bị đóng với mã: ${event.code} và lý do: ${event.reason}`);
        }
        setIsVideoConnect(false);
        console.log(`Disconnected from server - [${HOST}]`);
        setLoading(_ => true);
        if (imageRef.current !== null) {
          imageRef.current.src = null;
        }
        initVideoSocket();
      };
    }
  }

  useEffect(() => {
    initVideoSocket();

    return () => {
      if (socketVideoRef.current !== null) {
        socketVideoRef.current.close();
        console.log(`Disconnected from server - [${HOST}]`);
        setIsVideoConnect(false);
      }
    }
  }, [])

  return (
    <div className={styles.wrapperVideo}>
      {
        !loading ? (
          <img className={styles.video} ref={imageRef} alt="Frame" />
        ) : (
          <div className={styles.loading}>
            <Spin
              indicator={<LoadingOutlined />}
              size="large"
            >
              <></>
            </Spin>
          </div>
        )
      }
    </div>
  )
}

export default Frame;