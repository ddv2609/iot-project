import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styles from "./Footer.module.css";

function ContactInfo({ contact }) {
  return (
    <div className={styles[contact.name]}>
      <div className={styles.icon}>
        <FontAwesomeIcon icon={contact.icon} />
      </div>
      <div className={styles.description}>
        <a className={styles.anchor} href={contact.href}>
          <p className={styles.desPara}>{contact.content}</p>
        </a>
      </div>
    </div>
  )
}

export default ContactInfo;