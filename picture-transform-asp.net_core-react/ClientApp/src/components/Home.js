import React, { Component } from 'react';

export class Home extends Component {
    static displayName = Home.name;

    constructor(props) {
        super(props);
        this.state = { uri_list: [], loading: false };
    }

    static renderList(uri_list) {
        
        let content = uri_list.map((url, index)=> 
                <li><img src={url} alt={`Fragment ${index+1}`} style={{padding: '10px'}}/></li>);
        return (
            <ul style={{listStyleType: 'none'}}>
                {content}
            </ul>
        );
    }

    onClickFragmentsRequest = async (event) => {
        event.preventDefault();

        const rows = Number(document.getElementById("rows").value);
        const columns = Number(document.getElementById("columns").value);
        const url = document.getElementById("url").value;

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Request-Method': 'POST',
                'Access-Control-Request-Headers': 'Content-Type' 
            },
            body: JSON.stringify({ "Rows": rows, "Columns": columns, "ImageUrl": url })
        };

        this.setState({ loading: true });

        await fetch('https://127.0.0.1:7226/api/PictureTransform', requestOptions)
            .then(response => response.json())
            .then(data => this.setState({ uri_list: data, loading: false }))
            .catch(er => console.log(er), event.preventDefault());
    };

    // TODO add regex + is_num_valid to form
    render() {
        const contents = this.state.loading
            ? <p>Loading...</p>
            : Home.renderList(this.state.uri_list);

        return (
            <div>
                <h1>Тестовое задание: нарезка изображения.</h1>
                <table>
                    <thead>
                        <tr>
                            <td>
                                <h3>О приложении:</h3>
                            </td>
                            <td>
                                <h3></h3>
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>
                            <ul>
                            <li>Backend - ASP.Net Core</li>
                                    <li>Frontend - React</li>
                                    <li><a href="https://shorturl.at/hzRSU">Задание</a></li>
                                    <li><a href="https://github.com/gchurakov/picture-transform-asp.net_core-react">Github</a></li>
                            </ul>
                        </td>
                        <td>
                                <ul>
                                    <li>Бекенд нарезает картинку на необходимое количесто фрагментов</li>
                                    <li>Бекенд подписывает координаты левоге верхнего угла фрагмента</li>
                                    <li>Бекенд сохраняет фрагменты в публичной директории клиентского приложения</li>
                                    <li>При отправке POST-запроса проихсходит отправка OPTIONS для добавления заголовков</li>
                                    <li>В качестве ответа на POST-запрос приходит список URI для подгрузки фрагментов</li>
                                    
                                </ul>
                            </td>
                        <td>
                            <ul>
                                <li>Фронтенд отрисовывает форму, по нажати кнопки отправляет POST</li>
                                <li>Фронтенд при получении ответа добавляет на страницу список изображений</li>
                            </ul>
                        </td>
                    </tr>
                    </tbody>
                </table>

                <h3>Отправить запрос</h3>
                <form onSubmit={this.onClickFragmentsRequest}>
                    <p>Количество фрагментов по вертикали: <input type="text" id="columns" required /></p>
                    <p>Количество фрагментов по горизонтали: <input type="text" id="rows" required /></p>
                    <p>Ссылка на изображение: <input type="text" id="url" required /></p>
                    <button type="submit">Отправить</button>
                    <button type="reset">Очистить</button>
                </form>
                {contents}
            </div>
        );
    }
}
