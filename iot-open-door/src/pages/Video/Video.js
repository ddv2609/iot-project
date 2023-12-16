import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import styles from "./Video.module.css";
import VideoInfo from "../../components/VideoInfo/VideoInfo";

function Video() {
  const HOST = "192.168.207.38";
  const [toggle, setToggle] = useState(localStorage.getItem("door-state") === "1" ? true : false);
  const socketWsRef = useRef(null);
  const imageRef = useRef({ src: null });
  const [isWsConnect, setIsWsConnect] = useState(false);
  const [loading, setLoading] = useState(true);

  const initWsSocket = () => {
    if (socketWsRef.current === null || !isWsConnect) {
      console.log(`Connecting [${HOST}]...`);
      socketWsRef.current = new WebSocket(`ws://${HOST}:60/`);

      socketWsRef.current.onopen = () => {
        console.log(`Connected to server - [${HOST}]`);
        setIsWsConnect(true);
      };

      socketWsRef.current.onmessage = async (message) => {
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
  
      socketWsRef.current.onerror = (event) => {
        if (event.wasClean) {
          console.log('Kết nối đã được đóng một cách đúng đắn.');
        } else {
          console.log(`Kết nối bị đóng với mã: ${event.code} và lý do: ${event.reason}`);
        }
        setIsWsConnect(false);
        console.log(`Disconnected from server - [${HOST}]`);
        setLoading(true);
        initWsSocket();
      };
    }
  }

  useEffect(() => {
    console.log("Live Video call useEffect");

    document.title = "Video trực tuyến";

    initWsSocket();

    return () => {
      if (socketWsRef.current !== null) {
        socketWsRef.current.close();
        console.log(`Disconnected from server - [${HOST}]`);
      }
    }
  }, [])

  console.log("Live Video re-render");

  return (
    <div className={styles.liveVideo}>
      <div className={clsx([styles.wrapperLiveVideo, "container"])}>
        <VideoInfo toggle={toggle} setToggle={setToggle} socket={socketWsRef} loading={loading} />
        <div className={styles.wrapperVideo} >
          {
            !loading ? (
              <img className={styles.video} ref={imageRef} alt="Frame" />
            ) : (
              <Spin
                indicator={<LoadingOutlined />}
                size="large"
              >
                <></>
              </Spin>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default Video;