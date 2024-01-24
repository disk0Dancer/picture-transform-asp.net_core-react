import React, { Component } from 'react';
// import axios from 'axios';

export class Home extends Component {
  static displayName = Home.name;

    constructor(props) {
        super(props);
        this.state = { url_list: []};
    }

    componentDidMount() {
        this.fragmentsRequest();
    }


    static renderTable(url_list) {
        return (
            <table className="table" aria-labelledby="tableLabel">
                <tbody>
                {/*TODO : create columns and rows*/}
                
                {/*{url_list.map(url =>*/}
                {/*    <tr key={forecast.date}>*/}
                {/*        <td><img src={url}/></td>*/}
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
                <h1><a href="https://shorturl.at/hzRSU">Тестовое задание: нарезка изображения.</a></h1>
                <h3>О приложении:</h3>
                <ul>
                    <li>Backend - ASP.Net Core</li>
                    <li>Frontend - React</li>
                    <li><a href="">Репозиторий проекта на Github</a></li>
                </ul>
                <h3>Форма отправки изображения</h3>
                <h3>Изображение отправлено</h3>
                <form>
                    <p>Количество разрезов по вертикали: <input type="text" required/></p>
                    <p>Количество разрезов по горизонтали: <input type="text" required/></p>
                    <p>Ссылка на изображение 1600*1200: <input type="text" required/></p>
                    <button type="submit">Отправить</button>
                    <button type="button">Очистить</button>
                </form>
                {contents}
            </div>
        );
    }

    async fragmentsRequest() {
        const response = await fetch('api/PictureTransform');
        const data = await response.json();
        this.setState({uri_list: data, loading: false});
    }
}
