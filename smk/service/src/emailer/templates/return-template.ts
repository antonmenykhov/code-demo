function returnTemplate(actionsUrl: string) {
  return `
    <!DOCTYPE html>
<html lang="ru">
  <head> </head>
  <body>
    <p>КД возвращено на доработку</p>
    <a href="${actionsUrl}">Просмотреть КД</a>
  </body>
</html>
`;
}
export { returnTemplate };
