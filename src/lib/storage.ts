import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/**
 * Cliente de Neon Buckets (almacenamiento de objetos compatible con AWS S3)
 */
export const s3Client = new S3Client({
  endpoint: process.env.AWS_ENDPOINT_URL_S3,
  region: process.env.AWS_REGION || "us-east-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
  forcePathStyle: true,
});

export const BUCKET_NAME = process.env.S3_BUCKET || "etmedia";

/**
 * Genera una URL firmada para permitir que el cliente suba fotos directamente
 * al bucket de Neon sin sobrecargar el servidor de Next.js.
 */
export async function getPresignedUploadUrl(
  key: string,
  contentType: string,
  expiresInSeconds = 300
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  return getSignedUrl(s3Client, command, { expiresIn: expiresInSeconds });
}

/**
 * Genera una URL temporal para descarga o visualización privada de una imagen.
 */
export async function getPresignedDownloadUrl(
  key: string,
  expiresInSeconds = 3600
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  return getSignedUrl(s3Client, command, { expiresIn: expiresInSeconds });
}

/**
 * Sube un archivo directamente desde el servidor (Buffer o Uint8Array)
 */
export async function uploadFile(
  buffer: Buffer | Uint8Array,
  key: string,
  contentType: string
): Promise<{ success: boolean; key: string; publicUrl: string }> {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  });

  await s3Client.send(command);

  return {
    success: true,
    key,
    publicUrl: getPublicUrl(key),
  };
}

/**
 * Elimina una foto o archivo del bucket de Neon.
 */
export async function deleteFile(key: string): Promise<boolean> {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  await s3Client.send(command);
  return true;
}

/**
 * Devuelve la URL base pública del archivo en el bucket.
 */
export function getPublicUrl(key: string): string {
  const endpoint = (process.env.AWS_ENDPOINT_URL_S3 || "").replace(/\/$/, "");
  return `${endpoint}/${BUCKET_NAME}/${key}`;
}

/**
 * Lista los archivos guardados en el bucket con un prefijo dado (ej: "portfolio/", "vehicles/").
 */
export async function listMedia(prefix = "") {
  const command = new ListObjectsV2Command({
    Bucket: BUCKET_NAME,
    Prefix: prefix,
  });

  const response = await s3Client.send(command);
  return (
    response.Contents?.map((item) => ({
      key: item.Key ?? "",
      size: item.Size ?? 0,
      lastModified: item.LastModified,
      url: getPublicUrl(item.Key ?? ""),
    })) ?? []
  );
}
