import { Space } from "antd";
import clsx from "clsx";
import { useEffect } from "react";
import { ClockCircleOutlined } from "@ant-design/icons";

import styles from "./Home.module.css";

function Home() {

  useEffect(() => {
    document.title = "Open Door";

  }, [])

  return (
    <>
      <div className={clsx([styles.home, "container"])}>
        <div className={styles.introduce}>
          <Space className={styles.content} size={6} align="center">
            <ClockCircleOutlined className={styles.icon} />
            <h1>Chào mừng đến với hệ thống của chúng tôi</h1>
          </Space>
        </div>
      </div>
    </>
  )
}

export default Home;