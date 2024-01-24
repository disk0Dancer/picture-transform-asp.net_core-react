import React, { Component } from 'react';

export class Home extends Component {
  static displayName = Home.name;

  render() {
      return (
          <div>
              <h1><a href="https://shorturl.at/hzRSU">Тестовое задание: нарезка изображения 1600*1200.</a></h1>
              <h3>О приложении:</h3>
              <ul>
                  <li>Backend - ASP.Net Core</li>
                  <li>Frontend - React</li>
              </ul>
              <h3>Форма отправки изображения</h3>
              <h3>Изображение отправлено</h3>
              <form>
                  <p>Количество разрезов по вертикали: <input  type="text" required/></p>
                  <p>Количество разрезов по горизонтали: <input  type="text" required/></p>
                  <p>Ссылка на изображение 1600*1200: <input  type="text" required/></p>
                  <button  type="submit">Отправить</button>
                  <button type="button">Очистить</button>
              </form>
              
             
          </div>

          <div>
              <table>
                  <tbody>
                      
                  </tbody>
              </table>
          </div>
    );
  }

    async populateWeatherData() {
        const response = await fetch('api/PictureTransform');
        const data = await response.json();
        this.setState({ forecasts: data, loading: false });
    }
}
