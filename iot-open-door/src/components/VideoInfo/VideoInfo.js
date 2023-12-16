import { Col, Row, Space, Switch } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import moment from "moment/moment";
import { useEffect, useState } from "react";
import clsx from "clsx";

import styles from "./VideoInfo.module.css";

function VideoInfo({ toggle, setToggle, socket, loading }) {

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const updateRealTime = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(updateRealTime);
  })

  return (
    <div className={styles.videoInfo}>
      <Row align="middle" justify="center">
        <Col span={8}>
          <div className={styles.state}>
            <Space align="center">
              <EyeOutlined className={clsx([styles.iconState, styles.iconOn])} />
              <span className={clsx([styles.statelb, styles.stateOnlb])}>Video đang phát trực tiếp</span>
            </Space>
          </div>
        </Col>

        <Col span={8}>
          <div className={styles.time}>
            <span className={styles.timeDetail}>{moment(time).format("dddd, DD-MM-YYYY HH:mm:ss A")}</span>
          </div>
        </Col>

        <Col span={8}>
          <div className={styles.toggle}>
            <Space align="center">
              <span className={styles.actionlb}>{toggle ? "Cửa đang mở" : "Đã đóng cửa"}</span>
              <Switch checkedChildren="OPEN" unCheckedChildren="CLOSE" checked={toggle} disabled={loading}
                onChange={(checked, _) => {
                  try {
                    localStorage.setItem("door-state", checked ? "1" : "0");
                    setToggle(checked);
                    socket.current.send(checked ? 1 : 0);
                  } catch {}
                }} />
            </Space>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default VideoInfo;