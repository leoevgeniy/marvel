import { Component } from 'react';
import Spinner from './../spinner/Spinner'
import ErrorMessage from './../errorMessage/errorMessage';
import MarvelService from './../../services/MarvelService';
import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';

class RandomChar extends Component {
    state = {
        char: {},
        loading: true,
        error: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        // this.timeID = setInterval(this.updateChar, 3000);
        this.updateChar();
    }

    tryIt = () => {
        this.updateChar();
    }

    // componentWillUnmount() {
    //     clearInterval(this.timeID);
    // }

    onCharLoaded = (char) => {
        this.setState({char, loading: false});
    }

    onError = () => {
        this.setState({loading: false, error: true});
    }

    updateChar = () => {
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
        this.marvelService
            .getCharacter(id)
            .then(this.onCharLoaded)
            .catch(this.onError)
    }

    render() {
        const {char, loading, error} = this.state;
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? <View char={char}/> : null;
        return (
            <div className="randomchar">
                {errorMessage}
                {spinner}
                {content}
                <div className="randomchar__static">
                    <p className="randomchar__title">
                        Random character for today!<br/>
                        Do you want to get to know him better?
                    </p>
                    <p className="randomchar__title">
                        Or choose another one
                    </p>
                    <button onClick={this.tryIt} className="button button__main">
                        <div className="inner">try it</div>
                    </button>
                    <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
                </div>
            </div>
        )
    }
}

const View = ({char}) => {

    const {name, description, thumbnail, homepage, wiki} = char;
    let imgClassName = (thumbnail.search('image_not_available') > -1);
    // if (thumbnail.search('image_not_available') > -1) {
    //     imgClassName += ' randomchar__img_contain';
    // }
    return (
        <div className="randomchar__block">
            <img 
                src={thumbnail} 
                alt="Random character" 
                className={!imgClassName ? "randomchar__img" : "randomchar__img  randomchar__img_contain"} />
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">
                    {description}
                </p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default RandomChar;