<?php
/**
 * Exporta el contenido de Servicios y Soluciones (ES + EN) del tema de WordPress a JSON.
 * Uso: php scripts/export_json.php <ruta-del-tema> <carpeta-content>
 */
define( 'ABSPATH', __DIR__ );
define( 'KK_THEME_DIR', $argv[1] );
$theme = $argv[1];
$out   = rtrim( $argv[2], '/' );

$sets = array(
	'servicios'  => array( 'inc/servicios-pages-es.php', 'inc/servicios-pages-en.php' ),
	'soluciones' => array( 'inc/soluciones-pages-es.php', 'inc/soluciones-pages-en.php' ),
);

foreach ( $sets as $name => $files ) {
	$data = array();
	foreach ( $files as $f ) {
		$data = array_merge( $data, require $theme . '/' . $f );
	}
	// 'assets/images/...' (ruta del tema) -> '/assets/images/...' (public/ de Next).
	array_walk_recursive( $data, function ( &$v ) {
		if ( is_string( $v ) && 0 === strpos( $v, 'assets/' ) ) {
			$v = '/' . $v;
		}
	} );
	file_put_contents( "$out/$name.json", json_encode( $data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES ) );
	echo str_pad( $name, 11 ), count( $data ), " páginas\n";
}
