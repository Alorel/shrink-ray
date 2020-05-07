import {Request, RequestHandler, Response} from 'express';
import {BrotliEncodeParams} from 'iltorb';
import {ZlibOptions} from 'zlib';

interface Filterable {
  /**
   * A function to decide if the response should be considered for compression. This function is called as
   * filter(req, res) and is expected to return true to consider the response for compression, or false to not
   * compress the response.
   *
   * The default filter function uses the compressible module to determine if
   * res.getHeader('Content-Type') is compressible.
   */
  filter?(req: Request, res: Response): boolean;
}

interface ShrinkRayOptions extends Filterable {
  /**
   * To control the parameters of the brotli algorithm, pass in child object at the key brotli with one or more of the
   * following brotli algorithm parameters: lgblock, lgwin, mode, or quality.
   *
   * Note that unlike the standard brotli library, which defaults to quality 11, this library defaults to quality 4,
   * which is generally more appropriate for dynamic content.
   */
  brotli?: Partial<BrotliEncodeParams>;

  /**
   * The approximate size, in bytes, of the cache. This is a number of bytes, any string accepted by the bytes module,
   * or false to indicate no caching. The default cacheSize is 128mb.
   *
   * The size includes space for the URL of the cached resources and the compressed bytes of the responses. It does
   * not, however, include overhead for JavaScript objects, so the actual total amount of memory taken up by the cache
   * will be somewhat larger than cacheSize in practice.
   *
   * When deciding how large to make your cache, remember that every cached resource in your app may have as many as
   * three compressed entries: one each for gzip, deflate, and brotli.
   */
  cacheSize?: number | string | false;

  /**
   * The byte threshold for the response body size before compression is considered for the response, defaults to 1kb.
   * This is a number of bytes, any string accepted by the bytes module, or false.
   *
   * Note this is only an advisory setting; if the response size cannot be determined at the time the response
   * headers are written, then it is assumed the response is over the threshold. To guarantee the response size can be
   * determined, be sure set a Content-Length response header.
   */
  threshold?: number | string | false;

  /** Whether to use node-zopfli-es (true) or zlib (false) for gzip compression. Defaults to true. */
  useZopfliForGzip?: boolean;

  /**
   * There is a sub-object of the options object called zlib which contains all of the parameters related to gzip and
   * deflate.
   *
   * Also note that to temporarily preserve backwards compatibility with compression, all of these zlib parameters
   * can be included at the root level of the options object. However, having zlib parameters at the root level is
   * deprecated, and we plan to remove it.
   */
  zlib?: Partial<ZlibOptions>;

  /**
   * A function to decide if the compressed response should be cached for later use. This function is called as
   * cache(req, res) and is expected to return true if the compressed response should be cached and false if the
   * response should not be cached. Note that shrink-ray uses ETags to ensure that a cache entry is appropriate to
   * return, so it will never cache a response that does not include an ETag, even if the cache function returns true.
   *
   * When a response is cached, it will be asynchronously re-encoded at the highest quality level available for
   * the compression algorithm in question (zopfli for gzip and deflate, and brotli quality 11 for brotli). These
   * quality levels are generally not acceptable for use when responding to a request in real-time because they are
   * too CPU-intensive, but they can be performed in the background so that subsequent requests get the highest
   * compression levels available.
   *
   * By default, shrink-ray caches any response that has an ETag header associated with it, which means it should work
   * out of the box with express.static, caching static files with the highest available compression. If you serve a
   * large number of dynamic files with ETags, you may want to have your cache function restrict caching to your static
   * file directory so as to avoid thrashing the cache and wasting CPU time on expensive compressions.
   */
  cache?(req: Request, res: Response): boolean;
}

interface CreateMiddleware extends Filterable {
  (options?: ShrinkRayOptions): RequestHandler;
}

declare const createMiddleware: CreateMiddleware;

export = createMiddleware;
