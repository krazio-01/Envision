import './pageNotFound.css';
import { Link } from 'react-router-dom';

const PageNotFound = () => {
    return (
        <div className='notFound'>
            <div className='notFound-text'>
                <h1>
                    Oops Are You Lost?
                </h1>
            </div>

            <div className='notFound-redirect'>
                <span>Go Back To </span>
                <Link to='/'>Home</Link>
            </div>
        </div>
    )
}

export default PageNotFound
