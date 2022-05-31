class MarvelService {
    _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    _apiKey = 'apikey=d419db7d37b12120a428cd69f822e8af';
    getResouces = async (url) => {
        let res = await fetch(url);
        if(!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    }

    getAllCharacters = async () => {
        const res = await this.getResouces(`${this._apiBase}characters?limit=9&offset=210&${this._apiKey}`);
        return res.data.results.map(this._transformCharacter);
    }
    getCharacter = async (id) => {
        const res = await this.getResouces(`${this._apiBase}characters/${id}?${this._apiKey}`);
        return this._transformCharacter(res.data.results[0]);
    }
    kitcut = (text, limit) => {
        text = text.trim();
        if( text.length <= limit) return text;
        text = text.slice( 0, limit); // тупо отрезать по лимиту
        const lastSpace = text.lastIndexOf(" ");
        if( lastSpace > 0) { // нашлась граница слов, ещё укорачиваем
          text = text.substr(0, lastSpace);
        }
        return text + "...";
      }
    _transformCharacter = (char) => {

        return {
            name: char.name,
            description: this.kitcut(char.description, 200),
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url
        }
    }
}


export default MarvelService;