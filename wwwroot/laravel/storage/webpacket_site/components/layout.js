import styles from "./layout.module.css";

export default function Layout({ children }) {
    const clickyId = process.env.NEXT_PUBLIC_CLICKY;
    const href = "https://clicky.com/" + clickyId;
    const dataid = clickyId;
    return (
        <div className={styles.container + " flex flex-col justify-center"}>
            {children}
        </div>
    );
}
