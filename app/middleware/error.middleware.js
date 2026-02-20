export default function errorMiddleware(req, res) {
  res.status(404).render('error', { message: 'The requested endpoint is not found' });
}
