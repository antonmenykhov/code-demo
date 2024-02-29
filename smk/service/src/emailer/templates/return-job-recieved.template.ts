function returnJobRecieved(
  departmentName: string,
  actionsUrl: string,
  answerId: number,
) {
  return `
      <!DOCTYPE html>
  <html lang="ru">
    <head> </head>
    <body>
      <p>В сервисе «Анкетирование вспомогательных подразделений» получены доработки по КД № ${answerId} по СП ${departmentName}</p>
      <a href="${actionsUrl}">Просмотреть КД</a>
    </body>
  </html>
  `;
}
export { returnJobRecieved };
