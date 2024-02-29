function actionSendedTemplate(departmentName: string, actionsUrl: string) {
  return `
    <!DOCTYPE html>
<html lang="ru">
  <head> </head>
  <body>
    <p>Получены КД от ${departmentName}</p>
    <a href="${actionsUrl}">Просмотреть КД</a>
  </body>
</html>`;
}
export { actionSendedTemplate };
