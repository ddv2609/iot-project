import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styles from "./Footer.module.css";

function SocialNetwork({ connected }) {
  return (
    <li className={styles.list}>
      <a className={styles.anchor} href={connected.href} target="__blank" rel="noopener">
        <div className={styles.connectInfo}>
          <div className={clsx([styles.avatar, styles[connected.name]])}>
            <FontAwesomeIcon icon={connected.icon} />
          </div>
          <div className={styles.description}>
            <p className={styles.desPara}>{connected.desc}</p>
          </div>
        </div>
      </a>
    </li>
  )
}

export default SocialNetwork;