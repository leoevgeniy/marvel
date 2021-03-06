import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/errorMessage';
import Skeleton from '../skeleton/Skeleton';
import './charInfo.scss';
import useMarvelService from '../../services/MarvelService';
// import { setLevelRef } from '@testing-library/user-event/dist/types/utils';

const CharInfo = (props) => {

    const [char, setChar] = useState(null);
    const {loading, error, clearError, getCharacter} = useMarvelService();

    useEffect(() => {
        updateChar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.charID])

    const onCharLoaded = (char) => {
        setChar(char);
    }

    const updateChar = () => {
        const {charID} = props;
        if (!charID) {
            return
        } 
        clearError();
        getCharacter(charID)
            .then(onCharLoaded)

    }

    const skeleton = char || loading || error ? null : <Skeleton/>;
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error || !char) ? <View char={char}/> : null;

    return (
        <div className="char__info">
            {skeleton}
            {errorMessage}
            {spinner}
            {content}
        </div>
    )
}

const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = char;
    let imgStyle = {'objectFit' : 'cover'};
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = {'objectFit' : 'contain'};
    }
    return (
        <>
            <div className="char__basics">
            <img src={thumbnail} alt={name} style={imgStyle}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics.length > 0 ? null : "There is no comics with this character"}
                {
                    comics.map((item, i) => {
                        // eslint-disable-next-line
                        if (i > 9) return;
                        const comicId = item.resourceURI.substring(item.resourceURI.lastIndexOf('/') + 1);
                        return (
                            <Link key={comicId} className='char__comics-item' to={`/comics/${comicId}`}>
                                {item.name}
                            </Link>
                            // <li className="char__comics-item"
                            // key={i}>
                            //     {item.name}
                            // </li>
                        )
                    })
                }

            </ul>
        </>
    )
}

CharInfo.propTypes = {
    charID: PropTypes.number
}

export default CharInfo;