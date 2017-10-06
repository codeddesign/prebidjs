<?php

namespace Gator;

use GuzzleHttp\Client;

class Gator
{
    /**
     * @var string
     */
    protected $path = 'https://api.gator.io/v1/%s?%s';

    /**
     * @var string
     */
    protected $token;

    /**
     * @var Client
     */
    protected $client;

    /**
     * @var array
     */
    protected $query = [];

    /**
     * @param string $token
     *
     * @return Gator
     */
    public function __construct($token)
    {
        $this->token = $token;

        $this->client = new Client();

        $this->query = [
            'accessToken' => $this->token,
        ];
    }

    /**
     * @param string $method
     * @param array  $data
     *
     * @return string|stdClass
     */
    protected function fetch(string $method, array $data)
    {
        $query = http_build_query(
            array_merge(
                $this->query,
                $data
            ),
            null,
            '&',
            PHP_QUERY_RFC3986
        );

        $uri = sprintf($this->path, $method, $query);
        $response = $this->client->request('GET', $uri);

        $body = (string) $response->getBody();
        if ('application/json' == $response->getHeaderLine('content-type')) {
            $body = json_decode($body);
        }

        return $body;
    }

    /**
     * @param string $ip
     * @param string $ua
     * @param string $url
     * @param string $referrer
     *
     * @return string|stdClass
     */
    public function score(string $ip, string $ua, string $url, string $referrer)
    {
        return $this->fetch('score', compact('ip', 'ua', 'url', 'referrer'));
    }
}
