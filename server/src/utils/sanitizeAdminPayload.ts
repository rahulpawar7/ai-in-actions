/** Strip client/meta fields before applying admin JSON as a full document replace. */
export function sanitizeAdminPayload(payload: Record<string, unknown>) {
  const copy = { ...payload };
  delete copy.id;
  delete copy._id;
  delete copy.__v;
  delete copy.createdAt;
  delete copy.updatedAt;
  return copy;
}
