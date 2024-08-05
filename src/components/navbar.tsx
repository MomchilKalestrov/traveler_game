import styles from './navbar.module.css';

const Navbar = (
    props: { context: React.RefObject<HTMLElement>[] }
) => {
    let current: number = 0;

    const swapPage = (index: number) => {
        if(index < 0 || index >= props.context.length || index === current)
            return;

        current = index;
        console.log(`Swapped to page ${index}`);
    }

    return (
        <>
            <div className={ styles.NavContainer }>
                <img onClick={() => swapPage(0)} className={ styles.NavOption } src='./vite.svg'/>
                <img onClick={() => swapPage(1)} className={ styles.NavOption } src='./vite.svg'/>
                <img onClick={() => swapPage(2)} className={ styles.NavOption } src='./vite.svg'/>
            </div>
        </>
    );
}

export default Navbar;