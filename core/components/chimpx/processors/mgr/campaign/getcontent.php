<?php
/**
 * chimpx
 *
 * Copyright 2011 by Romain Tripault <romain@melting-media.com>
 *
 * chimpx is free software; you can redistribute it and/or modify it under the
 * terms of the GNU General Public License as published by the Free Software
 * Foundation; either version 2 of the License, or (at your option) any later
 * version.
 *
 * chimpx is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with
 * chimpx; if not, write to the Free Software Foundation, Inc., 59 Temple
 * Place, Suite 330, Boston, MA 02111-1307 USA
 *
 * @package chimpx
 */
/**
 * Get a campaign content (preview or view archive)
 *
 * http://apidocs.mailchimp.com/1.3/campaigncontent.func.php
 * 
 * @package chimpx
 * @subpackage processors
 */

$api = new MCAPI($modx->getOption('chimpx.apikey'));

// filters to apply to the query
$cid = isset($scriptProperties['id']) ? $scriptProperties['id'] : '';
$for_archive = true;

$getContent = $api->campaignContent($cid,$for_archive);

if ($api->errorCode) {
    $modx->log(modX::LOG_LEVEL_ERROR, 'Unable to get the content of the campaign, error n#: '. $api->errorCode .' message: '. $api->errorMessage);
} else {
    $modx->log(modX::LOG_LEVEL_ERROR, 'Campaign content = '. $getContent['html']);
    //return $getContent;
}