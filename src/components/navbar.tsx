import styles from './navbar.module.css';

const Navbar = (
    props: { context: React.RefObject<HTMLElement>[] }
) => {
    let current: number = 0;
    console.log(props.context);

    const swapPage = (index: number) => {
        if(index < 0 || index >= props.context.length || index === current)
            return;

        props.context[current].current!.style.display = 'none';
        props.context[index].current!.style.display = 'block';

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