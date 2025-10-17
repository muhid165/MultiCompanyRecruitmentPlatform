import app from "./app";
import log from "./Utils/logger";
import { PORT } from "./Config/index";

app.listen(PORT, () => {
  log.info(`Server running on port http://localhost:${PORT}`);
});
