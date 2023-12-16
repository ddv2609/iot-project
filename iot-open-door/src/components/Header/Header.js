import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Space } from "antd";
import clsx from "clsx";
import { faHome, faShield, faVideoCamera } from "@fortawesome/free-solid-svg-icons";

import styles from "./Header.module.css";

function Header() {

  return (
    <header className={styles.header}>
      <div className={clsx([styles.menuWrapper, "container"])}>

        <div className={styles.logo}>
          <Link
            to="/"
            className={styles.logoWrapper}
          >
            <div className={styles.wrapLogoImage}>
              <img className={styles.logoImage} src="/logo.png" alt="Open Door Logo" />
            </div>
            <div className={styles.logoName}>Open Door</div>
          </Link>
        </div>

        <ul className={styles.unorderList}>
          <li className={styles.list}>
            <Link
              className={styles.anchor}
              to="/"
            >
              <Space size={6} align="center">
                <FontAwesomeIcon icon={faHome} className={styles.icon} />
                Home
              </Space>
            </Link>
          </li>
          <li className={styles.list}>
            <Link className={styles.anchor} to='/video'>
              <Space size={6} align="center">
                <FontAwesomeIcon icon={faVideoCamera} className={styles.icon} />
                Video
              </Space>
            </Link>
          </li>
          <li className={styles.list}>
            <Link className={styles.anchor} to='/admin'>
              <Space size={6} align="center">
                <FontAwesomeIcon icon={faShield} className={styles.icon} />
                Admin
              </Space>
            </Link>
          </li>
        </ul>
      </div>
    </header >
  )
}

export default Header;