function reportSendedTemplate(
  departmentName: string,
  actionsUrl: string,
  answerId: number,
) {
  return `
    <!DOCTYPE html>
<html lang="ru">
  <head> </head>
  <body>
    <p>В сервисе «Анкетирование вспомогательных подразделений» получен отчет о выполнении КД № ${answerId} по СП ${departmentName}</p>
    <a href="${actionsUrl}">Просмотреть КД</a>
  </body>
</html>
`;
}
export { reportSendedTemplate };
