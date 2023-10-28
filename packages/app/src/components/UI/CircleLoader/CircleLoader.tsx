import styles from './CircleLoader.module.css';

export default function CircleLoader() {
    return (
        <svg className={styles.circularLoader} viewBox="25 25 50 50">
            <circle className={styles.loaderPathBg} cx="50" cy="50" r="20" fill="none"></circle>
            <circle className={styles.loaderPath} cx="50" cy="50" r="20" fill="none"></circle>
        </svg>
    );
}