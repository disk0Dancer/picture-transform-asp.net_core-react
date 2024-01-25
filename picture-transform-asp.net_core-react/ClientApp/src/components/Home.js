import React, { Component } from 'react';

export class Home extends Component {
  static displayName = Home.name;

    constructor(props) {
        super(props);
        this.state = { url_list: []};
    }

    // componentDidMount() {
    //     this.fragmentsRequest();
    // }


    static renderTable(url_list) {
        // let q = url_list.resize()
        
        return (
            <table className="table" aria-labelledby="tableLabel">
                <tbody>
                {/*TODO : create columns and rows*/}
                
                {/*{url_list.map(url =>*/}
                {/*    <tr>*/}
                {/*        <p>{url}</p>*/}
                {/*        /!*<img src={url} alt={url}/>*!/*/}
                {/*    </tr>*/}
                {/*)}*/}
                </tbody>
            </table>
        );
    }

    render() {
        let contents = this.state.loading
            ? <p></p>
            : Home.renderTable(this.state.uri_list);

        return (
            <div>
                <h1>Тестовое задание: нарезка изображения.</h1>
                <h3>О приложении:</h3>
                <ul>
                    <li>Backend - ASP.Net Core</li>
                    <li>Frontend - React</li>
                    <li><a href="https://shorturl.at/hzRSU">Задание</a></li>
                    <li><a href="https://github.com/gchurakov">Репозиторий проекта на Github</a></li>
                </ul>
                <h3>Отправить запрос</h3>
                <form>
                    <p>Количество разрезов по вертикали: <input type="text" id="columns" required/></p>
                    <p>Количество разрезов по горизонтали: <input type="text"  id="rows" required/></p>
                    <p>Ссылка на изображение: <input type="text"  id="url" required/></p>
                    <button type="submit"  onClick={Home.onClickfragmentsRequest}>Отправить</button>
                    <button type="reset">Очистить</button>
                </form>
                <p id="request"></p>
                <p id="responce"></p>
                {contents}
            </div>
        );
    }

    async onClickfragmentsRequest() {
        this.rows = Number(document.getElementById("rows").textContent);
        this.columns = Number(document.getElementById("columns").textContent);
        let url = document.getElementById("url").textContent;

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "Rows": this.rows, "Columns": this.columns, "ImageUrl": url })
        };

        document.getElementById("request").textContent = requestOptions;
        
        await fetch('/api/PictureTransform', requestOptions)
            .then(response => response.json())
            .then(data => this.setState({uri_list: data, loading: false}));

    }
}
